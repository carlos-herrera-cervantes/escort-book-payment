import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentService } from '../payment.service';

@Injectable()
export class EmptyCardsListener {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent('empty.cards', { async: true })
  async handleEmptyCards(customerId: string): Promise<void> {
    const cardPaymentMethod = await this.paymentService.getPaymentMethod({ name: 'Card' });
    await this.paymentService.unlinkPaymentMethod({
      paymentMethodId: cardPaymentMethod._id,
      userId: customerId,
    });
  }
}