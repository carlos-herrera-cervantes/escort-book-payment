import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentService } from '../payment.service';

@Injectable()
export class PaymentMethodGuard implements CanActivate {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const counter = await this.paymentService.countPaymentMethods({ _id: params?.id });

    if (!counter) throw new NotFoundException();

    return true;
  }
}