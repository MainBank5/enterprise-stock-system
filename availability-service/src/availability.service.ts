import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AvailabilityService {
  private readonly logger = new Logger(AvailabilityService.name);

  async checkAndReserve(items: Array<{ productId: string; quantity: number }>) {
    this.logger.log(`Checking ${items?.length ?? 0} items`);
    return { available: true, reserved: items };
  }
}
