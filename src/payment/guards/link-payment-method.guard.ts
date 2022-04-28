import { CanActivate, ConflictException, ExecutionContext, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentService } from '../payment.service';

export class LinkPaymentMethodGuard implements CanActivate {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params, body } = context.switchToHttp().getRequest();
    const counter = await this.paymentService
      .countLinkedPaymentMethods({ paymentMethodId: params?.id, userId: body?.user?.id });

    if (!counter) throw new NotFoundException();

    return true;
  }
}

@Injectable()
export class LinkPaymentMethodsGuard implements CanActivate {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    const counter = await this.paymentService.countLinkedPaymentMethods({
      paymentMethodId: { $in: body?.methods },
      userId: body?.user?.id,
    });

    if (counter) throw new ConflictException();

    return true;
  }
}