import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AppModule {}
