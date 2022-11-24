import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CardService } from '../../card/card.service';
import { PaymentService } from '../../payment/payment.service';
import { CreatePaymentDetail } from '../dto/create.dto';

@Injectable()
export class CardGuard implements CanActivate {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @Inject(CardService)
  private readonly cardService: CardService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    const paymentDetails = body?.paymentDetails as CreatePaymentDetail[];
    const paymentMethodIds = paymentDetails?.map(payment => payment.paymentMethodId);

    if (!paymentMethodIds.length) {
      throw new BadRequestException('At least one payment method should exist');
    }

    const paymentMethods = await this.paymentService.getPaymentMethods({
      _id: { $in: paymentMethodIds },
    });
    const paymentMethodNames = paymentMethods.map(paymentMethod => paymentMethod.name);

    if (!paymentMethodNames.includes('Card')) return true;

    const cards = paymentDetails?.filter(payment => payment.cardId);

    if (cards.length > 1) throw new BadRequestException('Just one card can be used');

    const card = await this.cardService.getOne({ _id: cards?.pop()?.cardId });

    if (!card) throw new NotFoundException('Card does not exist');

    if (card.customerId.toString() != body?.user?.id) {
      throw new ForbiddenException('The card does not correspond to the current customer');
    }

    return true;
  }
}
