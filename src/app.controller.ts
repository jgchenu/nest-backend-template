import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get()
  getHello(): string {
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
}
