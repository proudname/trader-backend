import { Module, MiddlewareConsumer  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradeModule } from './portfolio/trade.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyModule } from './strategy/strategy.module';
import { CatalogModule } from './catalog/catalog.module';
import { BullModule } from '@nestjs/bull';
import { AuthMiddleware, AuthModule } from '@rasp/auth';
import { UserModule } from '@rasp/user';
import { KeyPointsController } from './strategy/controllers/key-points.controller';
import { StrategyController } from './strategy/controllers/strategy.controller';
import { TradeController } from './portfolio/trade.controller';
import { TickerController } from './catalog/controllers/ticker.controller';

@Module({
  imports: [
    TradeModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    StrategyModule,
    CatalogModule,
    UserModule,
    AuthModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [TypeOrmModule]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('login')
      .forRoutes(KeyPointsController, StrategyController, TradeController, TickerController);
  }
}
