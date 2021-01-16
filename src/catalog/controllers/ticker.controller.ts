import { Body, Controller, Post } from '@nestjs/common';
import { Crud, CrudController } from "@nestjsx/crud";
import { TickerEntity } from '../entity/ticker.entity';
import { TickerService } from '../services/ticker.service';
import { TableDataDto } from '../dto/table-data.dto';
import { InternalException } from '@rasp/core';


@Crud({
  model: {
    type: TickerEntity,
  },
})
@Controller('api/catalog/tickers')
export class TickerController implements CrudController<TickerEntity> {
  constructor(public service: TickerService) {}

  @Post('load_table_data')
  async loadExternalResources(@Body() tableData: TableDataDto) {
    const pageData = await this.service.loadPage({
      sort: 'ticker',
      ...tableData
    });
    if (!pageData) {
      throw new InternalException('Empty result from external resource');
    }
    return {
      ok: 1,
      data: pageData
    }
  }
}
