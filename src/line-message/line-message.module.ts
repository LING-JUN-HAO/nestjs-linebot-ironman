import { Module } from '@nestjs/common';
import { LineMessageService } from './line-message.service';

@Module({
  providers: [LineMessageService],
  exports: [LineMessageService],
})
export class LineMessageModule {}
