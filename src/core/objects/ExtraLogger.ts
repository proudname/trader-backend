import { Logger } from '@nestjs/common';


export class ExtraLogger extends Logger {

  detailErr(message: string, data: any) {
    super.error({
      message,
      data
    })
  }

  detailInfo(message: string, data: any) {
    super.log({
      message,
      data
    })
  }
}