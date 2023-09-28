import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpMethod,
  HttpRequestConfig,
  HttpResponse,
  executeHttpRequest,
} from '@sap/cloud-sdk-core';
import { CountriesGatewayRest } from './countries-gateway-rest';

jest.mock('@sap/cloud-sdk-core', () => ({
  ...jest.requireActual('@sap/cloud-sdk-core'),
  executeHttpRequest: jest.fn(),
}));

const consoleErrorMock = jest.spyOn(console, 'error');

describe('CountriesGatewayRest', () => {
  let countriesGatewayRest: CountriesGatewayRest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountriesGatewayRest],
    }).compile();

    countriesGatewayRest = module.get<CountriesGatewayRest>(CountriesGatewayRest);
  });

  it('should be defined', () => {
    expect(countriesGatewayRest).toBeDefined();
  });

  describe('findByLanguage', () => {
    it('should return the response from executeHttpRequest', async () => {
      const language = 'EN';
      const expectedRequestConfig: HttpRequestConfig = {
        method: HttpMethod.GET,
        url: `/v2/lang/${language}`,
      };

      const expectedData = { sample: 123 };

      const expectedResponse: HttpResponse = {
        data: expectedData,
        headers: [],
        status: 200
      };

      (executeHttpRequest as jest.Mock).mockResolvedValueOnce(expectedResponse);

      const result = await countriesGatewayRest.findByLanguage(language);

      expect(executeHttpRequest).toHaveBeenCalledWith(
        { destinationName: 'RESTCountriesAPI' },
        expectedRequestConfig
      );

      expect(result).toBe(expectedData);
    });
  });
});