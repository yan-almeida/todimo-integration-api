import { DummyModule } from '@app/dummy';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppConfig from 'src/configs/app.config';
import TypeOrmConfig from 'src/configs/orm.config';
import ViaVarejoConfig from 'src/configs/via-varejo.config';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, ViaVarejoConfig],
    }),
    TypeOrmModule.forRoot(TypeOrmConfig),
    DummyModule,
    OrderModule,
    OrderItemModule,
  ],
})
export class AppModule {}
