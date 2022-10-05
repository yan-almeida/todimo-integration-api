import { TypeOrmLogger } from '@app/commons';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'todimo',
  password: process.env.DB_PASSWORD || 'todimo',
  database: process.env.DB_DATABASE || 'todimo',
  autoLoadEntities: true,
  synchronize: true,
  migrationsRun: false,
  logger: new TypeOrmLogger(),
  logging: 'all',
  ssl: process.env.DB_SSL,
  extra: process.env.DB_EXTRA,
} as TypeOrmModuleOptions;
