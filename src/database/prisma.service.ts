import { inject, injectable } from 'inversify';
//@ts-ignore
import { PrismaClient, UserModel } from '@prisma/client';

import { TYPES } from '../types';
import { ILogger } from '../logger/logget.interface';

console.log('-> UserModel', UserModel);
@injectable()
export class PrismaService {
	client: PrismaClient = new PrismaClient();

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	async connect(): Promise<void> {
		try {
			this.logger.log('[PrismaService] успешно подключились к базе данных');
			await this.client.$connect();
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error('[PrismaService] ошибка к подключении к базе данных ' + e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
