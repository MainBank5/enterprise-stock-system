import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();

    await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id"         TEXT NOT NULL,
        "email"      TEXT NOT NULL,
        "password"   TEXT NOT NULL,
        "name"       TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      )
    `);

    await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")
    `);

    this.logger.log('✅ Auth schema ready');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
