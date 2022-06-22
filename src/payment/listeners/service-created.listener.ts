import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceDocument } from '../../service/schemas/service.schema';
import { CreatePaymentDetailDTO } from '../../service/dto/create.dto';
import { PaymentService } from '../payment.service';
import { PaymentDetail } from '../schemas/payment-detail.schema';
import { Types } from 'mongoose';
import { ServiceEvents } from '../../config/event.config';

@Injectable()
export class ServiceCreatedListener {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent(ServiceEvents.Created, { async: true })
  async handleCreatedService(
    service: ServiceDocument,
    paymentDetails: CreatePaymentDetailDTO[],
  ): Promise<void> {
    const details = paymentDetails.map((element) => ({
      paymentMethodId: new Types.ObjectId(element.paymentMethodId),
      serviceId: service._id,
      quantity: element.quantity,
    })) as PaymentDetail[];
    const bulkResult = await this.paymentService.createPaymentDetail(details);

    service.paymentDetails = bulkResult.map((result) => result._id);
    await service.save();
  }
}
