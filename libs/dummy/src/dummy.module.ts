import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DummyProductClient, DummyUserClient } from './clients';
import DummyConfig from './configs/dummy.config';

@Global()
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
  providers: [DummyUserClient, DummyProductClient],
  exports: [DummyUserClient, DummyProductClient],
})
export class DummyModule {}
