import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { recordError } from '../prom';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log(exception.constructor);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    recordError(exception.name, exception.message);
    if (exception instanceof HttpException) {
      throw exception;
    } else {
      response.status(500).json({
        name: exception.name || 'unknown name',
        message: exception.message || 'unknown message',
      });
    }
  }
}
