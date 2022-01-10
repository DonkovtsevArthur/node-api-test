import { IConfigService } from './config.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { ILogger } from '../logger/logget.interface';

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const configDotenv: DotenvConfigOutput = config();

		if (configDotenv.error) {
			this.logger.error('[ConfigService] Не удалось прочитать .env или он отсутствует');
		} else {
			this.logger.log('[ConfigService] Конфигурация .env загружена');
			this.config = configDotenv.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
