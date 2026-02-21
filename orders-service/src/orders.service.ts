import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { makeWorkerUtils, WorkerUtils } from 'graphile-worker';
import { PrismaService } from './prisma.service';
import { TASKS } from './events';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private workerUtils: WorkerUtils;

  constructor(
    private readonly prisma: PrismaService,
    @Inject('EVENT_BUS') private readonly eventBus: ClientProxy,
  ) {}

  async onModuleInit() {
    this.workerUtils = await makeWorkerUtils({
      connectionString: process.env.DATABASE_URL,
    });
    await this.workerUtils.migrate();
    this.logger.log('✅ Graphile Worker ready');
  }

  async createOrder(payload: {
    userId: string;
    items: any[];
    total: number;
  }) {
    // Prisma auto-generates UUID via @default(uuid())
    const order = await this.prisma.order.create({
      data: {
        userId: payload.userId,
        items: payload.items,
        total: payload.total,
      },
    });

    this.logger.log(`Order created: ${order.id} for user ${order.userId}`);

    // Publish RabbitMQ event
    this.eventBus.emit('order.created', {
      orderId: order.id,
      userId: order.userId,
      total: order.total,
      items: order.items,
    });

    // Enqueue durable email job via Graphile Worker
    await this.workerUtils.addJob(
      TASKS.SEND_ORDER_CONFIRMATION_EMAIL,
      { orderId: order.id, userId: order.userId, total: order.total },
      { maxAttempts: 5, jobKey: `order-confirmation-${order.id}` },
    );

    return order;
  }

  async findById(id: string, userId: string) {
    return this.prisma.order.findFirst({ where: { id, userId } });
  }
}
