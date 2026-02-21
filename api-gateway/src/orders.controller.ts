import {
  Controller, Post, Get, Body, Param,
  Inject, UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './jwt.guard';
import { EVENTS } from './events';

class OrderItemDto {
  @IsString() productId: string;
  @IsNumber() quantity: number;
  @IsNumber() price: number;
}

class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber() total: number;
  // ← No userId here! It's extracted from the JWT token
}

@Controller('orders')
@UseGuards(JwtAuthGuard) // ← all routes require a valid JWT
export class OrdersController {
  constructor(@Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() dto: CreateOrderDto, @Request() req) {
    // req.user is populated by JwtStrategy.validate()
    const userId = req.user.id; // UUID from the JWT — backend generated
    return firstValueFrom(
      this.ordersClient.send(EVENTS.ORDER_CREATED, { ...dto, userId }),
    );
  }

  @Get(':id')
  async getOrder(@Param('id') id: string, @Request() req) {
    return firstValueFrom(
      this.ordersClient.send('get.order', { id, userId: req.user.id }),
    );
  }
}
