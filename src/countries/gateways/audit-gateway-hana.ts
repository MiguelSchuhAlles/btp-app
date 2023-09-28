import { Injectable } from '@nestjs/common';
import { AuditGatewayInterface } from './audit-gateway-interface';
import { CreateAuditLogDto } from '../dto/create-audit-log';
import * as hana from '@sap/hana-client';
import { randomUUID } from 'crypto';
import { getDestination } from '@sap/cloud-sdk-core';

const ACCESS_LOGS_TABLE: string = 'access_logs';
const DATABASE_DESTINATION_NAME: string = 'HanaCloudDB';
const DATABASE_SERVER_NODE: string = '8592b468-9381-4427-9095-95c0d7c259b9.hana.trial-us10.hanacloud.ondemand.com:443';

@Injectable()
export class AuditGatewayHana implements AuditGatewayInterface {

    async storeAccessAuditLog(storeAuditLogDto: CreateAuditLogDto): Promise<string> {
        const destination = await getDestination(DATABASE_DESTINATION_NAME);

        // How to connect: https://help.sap.com/docs/HANA_SERVICE_CF/1efad1691c1f496b8b580064a6536c2d/2cc98bf04df54c05bbbb7b2819b9a8af.html
        const connection = hana.createConnection({
            serverNode: DATABASE_SERVER_NODE,
            uid: destination.username,
            pwd: destination.password,
        });

        let record_id: string = '';

        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to HANA Cloud DB:', err);
                return;
            }

            record_id = randomUUID();
            const sql = `INSERT INTO ${ACCESS_LOGS_TABLE} (ID, REQUEST, USER_ID, USER_NAME) VALUES ('${record_id}', '${storeAuditLogDto.language}', '${storeAuditLogDto.userId}', '${storeAuditLogDto.userName}')`;

            connection.exec(sql, (err, count) => {
                if (err) {
                    console.error('Error storing data:', err);
                    record_id = '';
                } else {
                    console.log('Data stored successfully. Modified rows:', count);
                }

                connection.disconnect();
            });
        });

        return record_id;
    }
}