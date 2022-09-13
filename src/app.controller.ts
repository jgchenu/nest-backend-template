import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { recordError } from './common/prom';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('hello')
  getHello() {
    return this.appService.getHello();
  }

  @Get('testLog')
  testLog(): string {
    this.logger.info({
      message: 'this is hello info',
      context: AppController.name,
      ms: 50,
      a: 1,
      b: 2,
    });
    this.logger.warn({
      message: 'this is hello error',
      context: AppController.name,
      ms: 100,
      a: 1,
      b: 2,
    });
    return this.appService.getHello();
  }

  @Get('error')
  testRecordError() {
    try {
      const a = undefined;
      a.s = 1;
    } catch (error) {
      recordError(error.name, error.message);
    }
  }

  @Get('catch')
  testCatch() {
    const a = undefined;
    a.s = 1;
  }
}
