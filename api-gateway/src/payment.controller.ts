import {
  Controller, Post, Body, Inject,
  UseGuards, Request, Headers, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IsString, IsNumber } from 'class-validator';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './jwt.guard';

class ProcessPaymentDto {
  @IsString() orderId: string;
  @IsNumber() amount: number;
}

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(@Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  async processPayment(
    @Body() dto: ProcessPaymentDto,
    @Request() req,
    @Headers('idempotency-key') idempotencyKey: string,
  ) {
    return firstValueFrom(
      this.paymentClient.send('process.payment', {
        ...dto,
        userId: req.user.id,
        idempotencyKey: idempotencyKey ?? `${req.user.id}-${dto.orderId}`,
      }),
    );
  }
}
