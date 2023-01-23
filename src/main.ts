import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { utilities, WinstonModule } from 'nest-winston';
import { createLogger, format, Logger, transports } from 'winston';
import { AppConfig } from './app.config';
import { AppModule } from './app.module';

function createLoggerInstance(loglevel: string): Logger {
  return createLogger({
    transports: [
      new transports.Console({
        format: format.combine(format.timestamp(), format.ms(), utilities.format.nestLike('RSMS'))
      }),
      new transports.File({
        filename: 'server.log',
        format: format.combine(format.timestamp(), format.ms(), utilities.format.nestLike('RSMS', { colors: false })),
        level: loglevel
      })
    ]
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<AppConfig>>(ConfigService);
  app.useLogger(WinstonModule.createLogger({ instance: createLoggerInstance(configService.getOrThrow('logLevel')) }));
  app.setGlobalPrefix(configService.getOrThrow('basePath'));
  await app.listen(configService.getOrThrow('port'));
}
bootstrap();
