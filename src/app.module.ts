import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import envConfig from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
winston.transports.DailyRotateFile = DailyRotateFile;

const logLevels = ['info', 'error'];
import * as _ from 'lodash';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      load: [envConfig],
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.timestamp(),
        winston.format.printf(
          ({ context, level, timestamp, message, ms, ...meta }) => {
            return `${timestamp} [${level}] ${message}  ${
              context ? `[${context}]` : ''
            } ${ms ? `${ms}ms` : ''} meta: ${JSON.stringify(meta)}`;
          },
        ),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        ...logLevels.map(
          (level) =>
            new winston.transports.DailyRotateFile({
              filename: `logs/nest-%DATE%-${level}.log`,
              level: level,
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '14d',
            }),
        ),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get('database');
        return {
          type: 'mysql', // 数据库类型
          entities: [], // 数据表实体
          host: config.host, // 主机，默认为localhost
          port: config.port, // 端口号
          username: config.username, // 用户名
          password: config.password, // 密码
          database: config.database, //数据库名
          timezone: '+08:00',
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    CatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
