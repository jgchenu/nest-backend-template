import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ErrorExceptionFilter } from './common/filter/error-exception.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const wisLogger: Logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useGlobalFilters(
    new ErrorExceptionFilter(wisLogger),
    new HttpExceptionFilter(),
  );
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('管理后台')
    .setDescription('管理后台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
