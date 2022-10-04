import { TypeOrmLogger } from '@app/commons';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'totvs_integrator',
  password: process.env.DB_PASSWORD || 'totvs_integrator',
  database: process.env.DB_DATABASE || 'totvs_integrator',
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: false,
  logger: new TypeOrmLogger(),
  logging: 'all',
  ssl: process.env.DB_SSL,
  extra: process.env.DB_EXTRA,
} as TypeOrmModuleOptions;
