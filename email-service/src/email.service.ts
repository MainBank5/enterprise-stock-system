import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { run } from 'graphile-worker';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  async onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    run({
      connectionString: process.env.DATABASE_URL,
      concurrency: 5,
      taskList: {
        send_order_confirmation_email: async (payload: any) => {
          await this.sendOrderConfirmation(payload);
        },
      },
    }).catch(err => this.logger.error('Graphile Worker error: ' + err.message));
  }

  async sendOrderConfirmation(data: { orderId: string; userId: string; total: number }) {
    this.logger.log(`📨 Sending confirmation for order ${data.orderId}`);
    await this.transporter.sendMail({
      from: '"Enterprise Store" <noreply@enterprise.com>',
      to: `${data.userId}@enterprise.com`,
      subject: `Order Confirmed — #${data.orderId}`,
      html: `<h2>Order confirmed ✅</h2><p>Order: ${data.orderId}</p><p>Total: $${data.total}</p>`,
    });
  }
}
