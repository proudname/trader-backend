import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradeModule } from './trade/trade.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TradeModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
