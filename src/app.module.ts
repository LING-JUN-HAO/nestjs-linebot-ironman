import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LineConfigProvider } from '../config/line.config';
import { LineMiddleware } from './middleware/line.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [LineConfigProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 針對 webhook 路由使用 LINE 中介軟體驗證
    consumer.apply(LineMiddleware).forRoutes('webhook');
  }
}
