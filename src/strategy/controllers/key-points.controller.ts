import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { KeyPointEntity } from '../entity/key-point.entity';
import { KeyPointsService } from '../services/key-points.service';

@Crud({
  model: {
    type: KeyPointEntity
  },
})
@Controller('api/key_points')
export class KeyPointsController implements CrudController<KeyPointEntity> {
  constructor(public service: KeyPointsService) {
  }
}
