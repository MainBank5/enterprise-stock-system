import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: 'orders_queue',
      queueOptions: { durable: true },
      noAck: false,
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
  new Logger('Orders Service').log('🟢 Orders Service ready');
}
bootstrap();
