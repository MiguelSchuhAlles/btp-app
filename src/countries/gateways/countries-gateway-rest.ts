import { HttpMethod, HttpRequestConfig, executeHttpRequest } from "@sap/cloud-sdk-core";
import { CountriesGatewayInterface } from "./countries-gateway-interface";
import { Injectable } from "@nestjs/common";

const COUNTRIES_REST_DESTINATION_NAME: string = 'RESTCountriesAPI';

@Injectable()
export class CountriesGatewayRest implements CountriesGatewayInterface {

    async findByLanguage(language: string): Promise<any> {
        const requestConfig: HttpRequestConfig = {
            method: HttpMethod.GET,
            url: `/v2/lang/${language}`
        };

        const result = await executeHttpRequest({destinationName: COUNTRIES_REST_DESTINATION_NAME}, requestConfig);
        return result.data;
    }

}