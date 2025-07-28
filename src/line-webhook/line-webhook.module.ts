import { Module } from '@nestjs/common';
import { WeatherModule } from 'src/weather/weather.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { LineMessageModule } from 'src/line-message/line-message.module';
import { LineConfigProvider } from 'src/line-webhook/line-webhook.provider';
import { LineWebhookController } from './line-webhook.controller';
import { LineWebhookService } from './line-webhook.service';

@Module({
  imports: [WeatherModule, CloudinaryModule, LineMessageModule],
  controllers: [LineWebhookController],
  providers: [LineWebhookService, LineConfigProvider],
})
export class LineWebhookModule {}
