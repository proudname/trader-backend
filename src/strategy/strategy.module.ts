import { Module } from '@nestjs/common';
import { StrategyController } from './strategy.controller';
import { StrategyService } from './strategy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyEntity } from './entity/strategy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StrategyEntity])],
  controllers: [StrategyController],
  providers: [StrategyService],
  exports: [StrategyService, TypeOrmModule]
})
export class StrategyModule {}
