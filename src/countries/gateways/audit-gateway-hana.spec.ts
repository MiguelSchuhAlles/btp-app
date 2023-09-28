import { Test, TestingModule } from '@nestjs/testing';
import { AuditGatewayHana } from './audit-gateway-hana';
import { CreateAuditLogDto } from '../dto/create-audit-log';
import * as hana from '@sap/hana-client';
import { getDestination } from '@sap/cloud-sdk-core';

// Regular expression to check if string is a valid UUID
const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

jest.mock('@sap/hana-client', () => ({
  createConnection: jest.fn(),
}));

jest.mock('@sap/cloud-sdk-core', () => ({
  getDestination: jest.fn(),
}));

describe('AuditGatewayHana', () => {
  let auditGatewayHana: AuditGatewayHana;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditGatewayHana],
    }).compile();

    auditGatewayHana = module.get<AuditGatewayHana>(AuditGatewayHana);
  });

  it('should be defined', () => {
    expect(auditGatewayHana).toBeDefined();
  });

  describe('storeAccessAuditLog', () => {
    it('should store access audit log and return the ID', async () => {
      const createAuditLogDto: CreateAuditLogDto = {
        language: 'EN',
        userId: 'SOME_USER_ID',
        userName: 'SOME_USER'
      };
      
      (getDestination as jest.Mock).mockResolvedValueOnce({
        username: 'MOCKED_USERNAME',
        password: 'MOCKED_PASSWORD',
      });

      (hana.createConnection as jest.Mock).mockImplementationOnce((cfg) => {
        // Mocking a successful connection
        const connection = {
          connect: jest.fn((callback) => callback(null)),
          exec: jest.fn((sql, callback) => callback(null, 1)), // Mocking the callback call for one affected row
          disconnect: jest.fn(),
        };

        return connection;
      });

      const result = await auditGatewayHana.storeAccessAuditLog(createAuditLogDto);

      expect(regexExp.test(result)).toBeTruthy();
    });

    it('should handle errors when connecting to HANA Cloud DB', async () => {
      const createAuditLogDto: CreateAuditLogDto = {
        language: 'EN',
        userId: 'SOME_USER_ID',
        userName: 'SOME_USER'
      };

      (getDestination as jest.Mock).mockResolvedValueOnce({
        username: 'MOCKED_USERNAME',
        password: 'MOCKED_PASSWORD',
      });

      (hana.createConnection as jest.Mock).mockImplementationOnce((cfg) => {
        // Mocking a failed connection
        const connection = {
          connect: jest.fn((callback) => callback(new Error('Connection error'))),
          disconnect: jest.fn(),
        };

        return connection;
      });

      const result = await auditGatewayHana.storeAccessAuditLog(createAuditLogDto);

      expect(result).toBeFalsy();
    });

    it('should handle errors when storing data', async () => {
      const createAuditLogDto: CreateAuditLogDto = {
        language: 'EN',
        userId: 'SOME_USER_ID',
        userName: 'SOME_USER'
      };

      (getDestination as jest.Mock).mockResolvedValueOnce({
        username: 'MOCKED_USERNAME',
        password: 'MOCKED_PASSWORD',
      });

      (hana.createConnection as jest.Mock).mockImplementationOnce((cfg) => {
        // Mocking a successful connection, but failed sql execution
        const connection = {
          connect: jest.fn((callback) => callback(null)),
          exec: jest.fn((sql, callback) => callback(new Error('Data storage error'))),
          disconnect: jest.fn(),
        };

        return connection;
      });

      const result = await auditGatewayHana.storeAccessAuditLog(createAuditLogDto);

      expect(result).toBeFalsy();
    });
  });
});