import { InfraLogInterceptor, TimeoutInterceptor } from '@app/commons';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const APP_NAME = '@todimoIntegration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const config = new DocumentBuilder()
    .setTitle('Web API - Todimo')
    .setDescription('API responsável: Todimo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const configService = app.get(ConfigService);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new InfraLogInterceptor(configService),
    new TimeoutInterceptor(),
  );

  const port = configService.get<number>('app.port');

  await app.listen(port);
  const url = await app.getUrl();

  Logger.debug(`Application is running on: ${url}`);
  Logger.debug(`Swagger application is running on: ${url}/swagger`);
}
bootstrap();
