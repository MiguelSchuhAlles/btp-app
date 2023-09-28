import { Inject, Injectable } from '@nestjs/common';
import { CountriesGatewayInterface } from './gateways/countries-gateway-interface';
import { AuditGatewayInterface } from './gateways/audit-gateway-interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class CountriesService {

    constructor(
        @Inject('CountriesGatewayInterface')
        private countriesGateway: CountriesGatewayInterface,
        @Inject('AuditGatewayInterface')
        private auditGateway: AuditGatewayInterface
    ) { }

    async fetchCountryData(language: string, user: UserEntity): Promise<any> {

        this.auditGateway.storeAccessAuditLog({
            language,
            userId: user.userId,
            userName: user.userName
        });

        return await this.countriesGateway.findByLanguage(language);
    }
}
