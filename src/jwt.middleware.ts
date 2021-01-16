import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtStrategy } from '@rasp/auth';

@Injectable()
export class JwtMiddleware {
  private use: any;

  constructor(jwtStrategy: JwtStrategy) {
    // @ts-ignore
    const passportInstance = jwtStrategy.getPassportInstance();
    this.use = passportInstance.authenticate('jwt', { session: false });
  }
}