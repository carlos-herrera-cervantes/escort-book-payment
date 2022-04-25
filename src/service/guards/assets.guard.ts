import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EscortProfileService } from '../../escort-profile/escort-profile.service';
import { CardService } from '../../card/card.service';
import { PriceService } from '../../price/price.service';
import { In } from 'typeorm';

@Injectable()
export class AssetsGuard implements CanActivate {

  @Inject(CardService)
  private readonly cardService: CardService;

  @Inject(EscortProfileService)
  private readonly escortProfileService: EscortProfileService;

  @Inject(PriceService)
  private readonly priceService: PriceService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    const serviceIds: string[] = body.details.map(element => element.serviceId);

    const [cardCounter, escortCounter, priceCounter] = await Promise.all([
      this.cardService.count({ _id: body.cardId }),
      this.escortProfileService.count({ where: { escortId: body.escortId } }),
      this.priceService.countPriceDetail({ where: { id: In(serviceIds) } }),
    ]);

    const isValidAssets = cardCounter && escortCounter && priceCounter == serviceIds.length;

    if (isValidAssets) return true;

    throw new NotFoundException();
  }
}
