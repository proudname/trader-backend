import { Module } from '@nestjs/common';
import { TickerService } from './services/ticker.service';
import { TickerController } from './controllers/ticker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TickerEntity } from './entity/ticker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TickerEntity])],
  providers: [TickerService],
  controllers: [TickerController],
  exports: [TickerService]
})
export class CatalogModule {}
