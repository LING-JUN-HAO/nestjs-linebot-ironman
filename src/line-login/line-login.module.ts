import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LineLoginService } from './line-login.service';

@Module({
  imports: [HttpModule],
  providers: [LineLoginService],
  exports: [LineLoginService],
})
export class LineLoginModule {}
