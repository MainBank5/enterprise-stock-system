export const EVENTS = {
  ORDER_CREATED: 'order.created',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_CANCELLED: 'order.cancelled',
  PAYMENT_PROCESSED: 'payment.processed',
  CHECK_AVAILABILITY: 'check.availability',
} as const;

export const TASKS = {
  SEND_ORDER_CONFIRMATION_EMAIL: 'send_order_confirmation_email',
  SEND_PAYMENT_RECEIPT_EMAIL: 'send_payment_receipt_email',
} as const;
