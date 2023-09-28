import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import { CountriesGatewayInterface } from './gateways/countries-gateway-interface';
import { AuditGatewayInterface } from './gateways/audit-gateway-interface';
import { HttpResponse } from '@sap/cloud-sdk-core';

describe('CountriesService', () => {
  let countriesService: CountriesService;
  let countriesGatewayMock: jest.Mocked<CountriesGatewayInterface>;
  let auditGatewayMock: jest.Mocked<AuditGatewayInterface>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: 'CountriesGatewayInterface',
          useValue: {
            findByLanguage: jest.fn(),
          },
        },
        {
          provide: 'AuditGatewayInterface',
          useValue: {
            storeAccessAuditLog: jest.fn(),
          },
        },
      ],
    }).compile();

    countriesService = module.get<CountriesService>(CountriesService);
    countriesGatewayMock = module.get('CountriesGatewayInterface');
    auditGatewayMock = module.get('AuditGatewayInterface');
  });

  it('should be defined', () => {
    expect(countriesService).toBeDefined();
  });

  describe('fetchCountryData', () => {
    it('should fetch country data and store access audit log', async () => {
      const language = 'EN';

      const user = {
        userId: 'SOME_USER_ID',
        userName: 'SOME_USER',
      }

      const expectedData = { sample: 123 };

      const expectedHttpResponse: HttpResponse = {
        data: expectedData,
        headers: [],
        status: 200
      };

      countriesGatewayMock.findByLanguage.mockResolvedValueOnce(expectedHttpResponse);

      await countriesService.fetchCountryData(language, user);

      expect(countriesGatewayMock.findByLanguage).toHaveBeenCalledWith(language);
      expect(auditGatewayMock.storeAccessAuditLog).toHaveBeenCalledWith({
        language,
        userId: user.userId,
        userName: user.userName
      });
    });
  });
});