import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';

@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'availability' };
  }
}
