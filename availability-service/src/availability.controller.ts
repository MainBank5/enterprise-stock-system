import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { AvailabilityService } from './availability.service';

@Controller()
export class AvailabilityController {
  constructor(private readonly svc: AvailabilityService) {}

  @MessagePattern('check.availability')
  async check(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    const result = await this.svc.checkAndReserve(data.items);
    channel.ack(msg);
    return result;
  }
}
