import { Module } from '@nestjs/common';
import { WeatherModule } from 'src/weather/weather.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { LineWebhookController } from './line-webhook.controller';
import { LineWebhookService } from './line-webhook.service';
import { LineConfigProvider } from 'src/line-webhook/line-webhook.provider';

@Module({
  imports: [WeatherModule, CloudinaryModule],
  controllers: [LineWebhookController],
  providers: [LineWebhookService, LineConfigProvider],
})
export class LineWebhookModule {}
