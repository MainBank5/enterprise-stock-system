import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: { urls: [process.env.RABBITMQ_URL], queue: 'availability_queue', queueOptions: { durable: true }, noAck: false },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4003);
  new Logger('Availability Service').log(' Availability Service ready');
}
bootstrap();
