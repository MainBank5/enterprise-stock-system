import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  private readonly logger = new Logger(EmailController.name);
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      await this.emailService.sendOrderConfirmation(data);
      channel.ack(msg);
    } catch (err) {
      this.logger.error(err.message);
      channel.nack(msg, false, true);
    }
  }
}
