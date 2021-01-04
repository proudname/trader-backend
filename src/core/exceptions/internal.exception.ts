import { HttpException, HttpStatus } from '@nestjs/common';


export class InternalException extends HttpException {
  constructor(message: string, code?: number) {
    const response: { ok: 1|0, message: string, code?: number} = {
      message,
      ok: 0
    }
    if (typeof code === 'number') response.code = code;
    super(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}