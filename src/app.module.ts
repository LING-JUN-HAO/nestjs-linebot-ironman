import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { LineMiddleware } from './middleware/line.middleware';
import { LineWebhookModule } from './line-webhook/line-webhook.module';
import { getLoggerModuleConfig } from 'config/logger.config';
import { LineMessageModule } from './line-message/line-message.module';
import configuration from 'config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getLoggerModuleConfig,
    }),
    LineWebhookModule,
    LineMessageModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 針對 webhook 路由使用 LINE 中介軟體驗證
    consumer.apply(LineMiddleware).forRoutes('webhook');
  }
}
