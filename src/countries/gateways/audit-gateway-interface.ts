import { CreateAuditLogDto } from "../dto/create-audit-log";

export interface AuditGatewayInterface {
    storeAccessAuditLog(storeAuditLogDto: CreateAuditLogDto): Promise<string>;
}