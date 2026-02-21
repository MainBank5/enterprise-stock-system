import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { OrdersController } from './orders.controller';
import { PaymentController } from './payment.controller';
import { AvailabilityController } from './availability.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'fallback_secret',
    }),

    ClientsModule.registerAsync([
      {
        name: 'ORDERS_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'orders_queue',
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: 'PAYMENT_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'payments_queue',
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: 'AVAILABILITY_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'availability_queue',
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [OrdersController, PaymentController, AvailabilityController],
  providers: [JwtStrategy],
})
export class AppModule {}
