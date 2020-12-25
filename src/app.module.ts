import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradeModule } from './portfolio/trade.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyModule } from './strategy/strategy.module';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [TradeModule, ConfigModule.forRoot(), TypeOrmModule.forRoot(), StrategyModule, CatalogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
