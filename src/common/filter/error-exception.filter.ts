import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { recordError } from '../prom';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (!(exception instanceof Error)) {
      return;
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    recordError(exception.name, exception.message);
    response.status(500);
    response.send(
      `Internal Error,error: ${exception.name} message: ${exception.message}`,
    );
  }
}
