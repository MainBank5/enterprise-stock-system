import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();

    // ── Run each statement separately (Prisma doesn't support multi-statement) ──
    // ── Use DO block to safely create enum only if it doesn't exist ──────────
    await this.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "OrderStatus" AS ENUM ('PENDING','CONFIRMED','CANCELLED','COMPLETED');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id"         TEXT NOT NULL,
        "user_id"    TEXT NOT NULL,
        "status"     "OrderStatus" NOT NULL DEFAULT 'PENDING',
        "total"      DOUBLE PRECISION NOT NULL,
        "items"      JSONB NOT NULL DEFAULT '[]',
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
      )
    `);

    this.logger.log('✅ Orders schema ready');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
