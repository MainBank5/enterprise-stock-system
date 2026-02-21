import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('API Gateway');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`🚀 API Gateway running on port ${port}`);
}
bootstrap();
