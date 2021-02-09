import { Module, MiddlewareConsumer  } from '@nestjs/common';
import { TradeModule } from './trade/trade.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyModule } from './strategy/strategy.module';
import { CatalogModule } from './catalog/catalog.module';
import { BullModule } from '@nestjs/bull';
import { AuthModule, JwtMiddleware } from '@rasp/auth';
import { UserController, UserModule } from "@rasp/user";
import { KeyPointsController } from './strategy/controllers/key-points.controller';
import { StrategyController } from './strategy/controllers/strategy.controller';
import { TradeController } from './trade/trade.controller';
import { TickerController } from './catalog/controllers/ticker.controller';



@Module({
  imports: [
    TradeModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    StrategyModule,
    CatalogModule,
    UserModule,
    AuthModule.register({
      jwtKey: process.env.JWT_KEY
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      },
    })
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule]
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude('login')
      .forRoutes(KeyPointsController, StrategyController, TradeController, TickerController, UserController);
  }
}
