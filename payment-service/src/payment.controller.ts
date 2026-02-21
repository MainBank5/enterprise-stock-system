import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('process.payment')
  async handleProcessPayment(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const result = await this.paymentService.processPayment(data);
      channel.ack(msg);
      return { success: true, payment: result };
    } catch (err) {
      this.logger.error(`Payment failed: ${err.message}`);
      channel.nack(msg, false, false);
      return { success: false, error: err.message };
    }
  }
}
