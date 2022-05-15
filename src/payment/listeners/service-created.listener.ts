import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceDocument } from '../../service/schemas/service.schema';
import { CreatePaymentDetailDTO } from '../../service/dto/create.dto';
import { PaymentService } from '../payment.service';
import { PaymentDetail } from '../schemas/payment-detail.schema';
import { Types } from 'mongoose';

@Injectable()
export class ServiceCreatedListener {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent('service.created', { async: true })
  async handleCreatedService(
    service: ServiceDocument,
    paymentDetails: CreatePaymentDetailDTO[],
  ): Promise<void> {
    const details = paymentDetails.map(element => ({
      paymentMethodId: new Types.ObjectId(element.paymentMethodId),
      serviceId: service._id,
      quantity: element.quantity,
    })) as PaymentDetail[];

    const bulkResult = await this.paymentService.createPaymentDetail(details);
    const ids = bulkResult.map(result => result._id);

    service.paymentDetails = ids;
    await service.save();
  }
}