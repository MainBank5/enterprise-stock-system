import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [EmailController],
  providers: [EmailService],
})
export class AppModule {}
