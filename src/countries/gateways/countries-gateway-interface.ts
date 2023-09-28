export interface CountriesGatewayInterface {
    findByLanguage(language: string): Promise<any>;
}