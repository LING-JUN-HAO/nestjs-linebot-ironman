import { Controller, Head } from '@nestjs/common';

@Controller('heartbeat')
export class HeartbeatController {
  @Head('')
  heartbeat(): string {
    return 'OK';
  }
}
