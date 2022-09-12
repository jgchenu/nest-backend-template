import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'winston';
import { recordError, RequestTotalCounter } from '../prom';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost) {
    console.log(exception.constructor);
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const path = request.route?.path || request.path || request.url;
    const response = ctx.getResponse<Response>();

    // metrics
    recordError(exception.name, exception.message);
    RequestTotalCounter.labels(request.method, path, String(500)).inc();

    if (exception instanceof HttpException) {
      throw exception;
    } else {
      const error = {
        name: exception.name || 'unknown name',
        message: (exception.message || 'unknown message').substring(0, 100),
      };
      this.logger.error(error);
      response.status(500).json({
        name: exception.name || 'unknown name',
        message: (exception.message || 'unknown message').substring(0, 100),
      });
    }
  }
}
