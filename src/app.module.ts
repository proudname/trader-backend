import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradeModule } from './portfolio/trade.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyModule } from './strategy/strategy.module';
import { CatalogModule } from './catalog/catalog.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TradeModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    StrategyModule,
    CatalogModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
