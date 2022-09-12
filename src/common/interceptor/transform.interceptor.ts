import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { register } from 'prom-client';
import { map, Observable } from 'rxjs';

export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const url = context.switchToHttp().getRequest<Request>().url;
    const response = context.switchToHttp().getResponse<Response>();
    if (url === '/api/metrics') {
      response.contentType(register.contentType);
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 0,
          msg: 'success',
        };
      }),
    );
  }
}
