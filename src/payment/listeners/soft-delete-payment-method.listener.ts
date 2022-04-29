import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentService } from '../payment.service';

@Injectable()
export class SoftDeletePaymentMethodListener {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent('soft.delete.payment.method', { async: true })
  async handleSoftDeletePaymentMethod(paymentMethodId: string): Promise<void> {
    await this.paymentService.unlinkPaymentMethod({ paymentMethodId });
  }
}
