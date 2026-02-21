import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { EVENTS } from './events';

@Controller()
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern(EVENTS.ORDER_CREATED)
  async handleCreateOrder(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const order = await this.ordersService.createOrder(data);
      channel.ack(msg);
      return { success: true, order };
    } catch (err) {
      this.logger.error(err.message);
      channel.nack(msg, false, false);
      return { success: false, error: err.message };
    }
  }

  @MessagePattern('get.order')
  async handleGetOrder(@Payload() data: { id: string; userId: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    const order = await this.ordersService.findById(data.id, data.userId);
    channel.ack(msg);
    return order;
  }
}
