import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { CountriesGatewayRest } from './gateways/countries-gateway-rest';
import { AuditGatewayHana } from './gateways/audit-gateway-hana';
import { UserEntity } from 'src/entities/user.entity';
import { HttpException } from '@nestjs/common';

jest.mock('./countries.service');

describe('CountriesController', () => {
  let controller: CountriesController;
  let service: CountriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        CountriesService, 
        CountriesGatewayRest,
        {
          provide: 'CountriesGatewayInterface',
          useExisting: CountriesGatewayRest
        },
        AuditGatewayHana,
        {
          provide: 'AuditGatewayInterface',
          useExisting: AuditGatewayHana
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    service = module.get<CountriesService>(CountriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCountries', () => {
    it('should return country data', async () => {
      const mockResult = [ { country: 'Argentina' }, { country: 'Brazil'} ]
      jest.spyOn(service, 'fetchCountryData').mockResolvedValue(mockResult);

      const mockUser: UserEntity = { userId: 'SOME_USER_ID', userName: 'SOME_USER' };
      const languageParam = 'EN';

      const result = await controller.getCountries(languageParam, mockUser);

      expect(service.fetchCountryData).toHaveBeenCalledWith(languageParam, mockUser);
      expect(result).toEqual(mockResult);
    });

    it('should handle errors and throw HttpException', async () => {
      jest.spyOn(service, 'fetchCountryData').mockRejectedValue(new Error('Error'));

      const mockUser: UserEntity = { userId: 'SOME_USER_ID', userName: 'SOME_USER' };
      const languageParam = 'EN';

      await expect(controller.getCountries(languageParam, mockUser)).rejects.toThrowError(HttpException);
    });
  });
});
