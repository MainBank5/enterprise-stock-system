import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();

    await this.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','SUCCESS','FAILED','REFUNDED');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id"               TEXT NOT NULL,
        "order_id"         TEXT NOT NULL,
        "user_id"          TEXT NOT NULL,
        "amount"           DOUBLE PRECISION NOT NULL,
        "status"           "PaymentStatus" NOT NULL DEFAULT 'PENDING',
        "idempotency_key"  TEXT NOT NULL,
        "provider"         TEXT,
        "transaction_id"   TEXT,
        "created_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
      )
    `);

    await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "payments_idempotency_key_key"
      ON "payments"("idempotency_key")
    `);

    this.logger.log('✅ Payments schema ready');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
