import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LineWebhookController } from './line-webhook.controller';
import { LineWebhookService } from './line-webhook.service';
import { LineConfigProvider } from 'config/line.config';

@Module({
  imports: [HttpModule],
  controllers: [LineWebhookController],
  providers: [LineWebhookService, LineConfigProvider],
})
export class LineWebhookModule {}
