import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { typeOrmConfig } from './typeorm-config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default new DataSource(typeOrmConfig);
