import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentService } from '../payment.service';

@Injectable()
export class CardCreatedListener {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent('card.created', { async: true })
  async handleCardCreated(customerId: string): Promise<void> {
    const cardPaymentMethod = await this.paymentService.getPaymentMethod({
      name: 'Card',
    });
    const counter = await this.paymentService.countLinkedPaymentMethods({
      userId: customerId,
      paymentMethodId: cardPaymentMethod._id,
    });

    if (counter) return;

    const paymentMethods = [
      { paymentMethodId: cardPaymentMethod._id, userId: customerId },
    ];
    await this.paymentService.linkPaymentMethods(paymentMethods);
  }
}
