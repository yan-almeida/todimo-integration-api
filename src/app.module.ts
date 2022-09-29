import { DummyModule } from '@app/dummy';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DummyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
