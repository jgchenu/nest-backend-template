import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import envConfig from './config/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
  WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
winston.transports.DailyRotateFile = DailyRotateFile;

const rotateFileParams = {
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

const nestLikeParams = {
  colors: false,
  prettyPrint: false,
};

const logLevels = ['info', 'debug', 'error', 'warn'];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        ...logLevels.map(
          (level) =>
            new winston.transports.DailyRotateFile({
              filename: `logs/nest-%DATE%-${level}.log`,
              level: level,
              format: winston.format.combine(
                winston.format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(
                  WINSTON_MODULE_NEST_PROVIDER,
                  nestLikeParams,
                ),
              ),
              ...rotateFileParams,
            }),
        ),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [], // 数据表实体
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', 'root'), // 密码
        database: configService.get('DB_DATABASE', 'test'), //数据库名
        timezone: '+08:00',
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    CatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
