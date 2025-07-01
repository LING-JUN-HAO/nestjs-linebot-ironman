import { WebhookRequestBody } from '@line/bot-sdk';
import { Body, Controller, Post } from '@nestjs/common';
import { LineWebhookService } from './line-webhook.service';

@Controller()
export class LineWebhookController {
  constructor(private readonly lineWebhookService: LineWebhookService) {}

  @Post('/webhook')
  async handleWebhook(@Body() body: WebhookRequestBody): Promise<string> {
    return this.lineWebhookService.processWebhook(body);
  }
}
