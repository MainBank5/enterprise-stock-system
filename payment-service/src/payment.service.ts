import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processPayment(data: {
    orderId: string;
    userId: string;
    amount: number;
    idempotencyKey: string;
  }) {
    // ── IDEMPOTENCY CHECK ──────────────────────────────────────
    // If a payment with this key already exists, return it as-is.
    // This prevents double-charges on retries or duplicate requests.
    const existing = await this.prisma.payment.findUnique({
      where: { idempotencyKey: data.idempotencyKey },
    });

    if (existing) {
      this.logger.warn(
        `Duplicate payment request detected. Returning existing: ${existing.id}`
      );
      return {
        ...existing,
        idempotent: true, // flag so caller knows this was a cached result
      };
    }

    // ── CREATE PENDING RECORD FIRST ────────────────────────────
    // Write-first pattern: record exists before charge attempt,
    // so even if the provider call crashes we can reconcile later.
    const payment = await this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        userId: data.userId,
        amount: data.amount,
        idempotencyKey: data.idempotencyKey,
        status: 'PENDING',
      },
    });

    try {
      // ── TODO: call your payment provider here (Stripe, M-Pesa, etc.)
      // const charge = await stripe.charges.create({ amount, currency: 'usd' });
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const updated = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          transactionId,
          provider: 'mock',
        },
      });

      this.logger.log(`✅ Payment ${updated.id} succeeded for order ${data.orderId}`);
      return { ...updated, idempotent: false };

    } catch (err) {
      // Mark as failed so it can be retried with a new idempotency key
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
      throw err;
    }
  }
}
