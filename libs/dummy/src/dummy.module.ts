import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DummyUserClient } from './clients';
import DummyConfig from './configs/dummy.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DummyConfig],
    }),
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseURL = configService.get('dummy.url');

        return {
          baseURL,
        };
      },
    }),
  ],
  providers: [DummyUserClient],
  exports: [DummyUserClient],
})
export class DummyModule {}
