import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentEvents } from '../../config/event.config';
import { PaymentService } from '../payment.service';

@Injectable()
export class PaymentListener {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent(PaymentEvents.SoftDelete, { async: true })
  async handleSoftDeletePaymentMethod(paymentMethodId: string): Promise<void> {
    await this.paymentService.unlinkPaymentMethod({ paymentMethodId });
  }
}
