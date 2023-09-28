import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { CountriesGatewayRest } from './gateways/countries-gateway-rest';
import { AuditGatewayHana } from './gateways/audit-gateway-hana';

@Module({
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
})
export class CountriesModule {}
