import { Module } from '@nestjs/common';
import { LineWebhookController } from './line-webhook.controller';
import { LineWebhookService } from './line-webhook.service';
import { LineConfigProvider } from 'config/line.config';

@Module({
  controllers: [LineWebhookController],
  providers: [LineWebhookService, LineConfigProvider],
})
export class LineWebhookModule {}
