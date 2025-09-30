import { DataSourceOptions } from 'typeorm';

import { SnakeCaseNamingStrategy } from '../strategies/snake-case.startegy';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_DATABASE || 'karua_crm',
  username: process.env.DB_USERNAME || 'karua_user',
  password: process.env.DB_PASSWORD || 'karua_password',
  logNotifications: true,
  schema: 'public',
  ssl: process.env.DB_SSL == 'true' ? true : false,
  migrations: [`${__dirname}/../migrations/**`],
  namingStrategy: new SnakeCaseNamingStrategy(),
};
