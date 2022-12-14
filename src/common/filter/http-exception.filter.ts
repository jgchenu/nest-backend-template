import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestTotalCounter } from '../prom';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码
    const path = request.route?.path || request.path || request.url;
    const exceptionResponse: any = exception.getResponse();
    let validMessage = '';

    if (typeof exceptionResponse === 'object') {
      validMessage = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message.join(';')
        : exceptionResponse.message || '';
    }
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

    const errorResponse = {
      data: {},
      message: validMessage || message,
      code: -1,
    };

    // metrics
    RequestTotalCounter.labels(request.method, path, String(status)).inc();

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status).contentType('application/json').json(errorResponse);
  }
}
