import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { register } from 'prom-client';
import { map, Observable, tap } from 'rxjs';
import { ResponseTimeHistogram } from '../prom';

export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const url = request.url;
    const method = request.method;
    const path = request.route.path || request.path || request.url;
    if (url === '/api/metrics') {
      response.contentType(register.contentType);
      return next.handle();
    }
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        ResponseTimeHistogram.labels(
          method,
          path,
          String(response.statusCode),
        ).observe(delay);
      }),
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
