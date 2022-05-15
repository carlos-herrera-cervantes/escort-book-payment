import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EscortProfileService } from '../../escort-profile/escort-profile.service';
import { PriceService } from '../../price/price.service';
import { In } from 'typeorm';
import { PaymentService } from '../../payment/payment.service';

@Injectable()
export class AssetsGuard implements CanActivate {
  @Inject(EscortProfileService)
  private readonly escortProfileService: EscortProfileService;

  @Inject(PriceService)
  private readonly priceService: PriceService;

  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    const serviceIds = body.details.map(element => element.serviceId);
    const paymentIds = body.paymentDetails.map(element => element.paymentMethodId);

    const [escortCounter, priceCounter, paymentMethodsCounter] = await Promise.all([
      this.escortProfileService.count({ where: { escortId: body.escortId } }),
      this.priceService.countPriceDetail({ where: { id: In(serviceIds) } }),
      this.paymentService.countLinkedPaymentMethods({
        userId: body.escortId,
        paymentMethodId: { $in: paymentIds },
      }),
    ]);

    const validAssets = escortCounter
      && priceCounter == serviceIds.length
      && paymentMethodsCounter == paymentIds.length;

    if (validAssets) return true;

    throw new NotFoundException();
  }
}
