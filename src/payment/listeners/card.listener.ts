import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CardEvents } from '../../config/event.config';
import { PaymentService } from '../payment.service';

@Injectable()
export class CardListener {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent(CardEvents.Created, { async: true })
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

  @OnEvent(CardEvents.Empty, { async: true })
  async handleEmptyCards(customerId: string): Promise<void> {
    const cardPaymentMethod = await this.paymentService.getPaymentMethod({
      name: 'Card',
    });
    await this.paymentService.unlinkPaymentMethod({
      paymentMethodId: cardPaymentMethod._id,
      userId: customerId,
    });
  }
}
