import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceDocument } from '../../service/schemas/service.schema';
import { CreatePaymentDetailDTO } from '../../service/dto/create.dto';
import { PaymentService } from '../payment.service';
import { PaymentDetail } from '../schemas/payment-detail.schema';
import { Types } from 'mongoose';
import { ServiceEvents } from '../../config/event.config';
import { ServiceStatus } from '../../service/enums/status.enum';
import { Payment } from '../schemas/payment.schema';

@Injectable()
export class ServiceListener {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent(ServiceEvents.Created, { async: true })
  async handleCreatedService(
    service: ServiceDocument,
    paymentDetails: CreatePaymentDetailDTO[],
  ): Promise<void> {
    const details = paymentDetails.map((element) => ({
      paymentMethodId: new Types.ObjectId(element.paymentMethodId),
      serviceId: new Types.ObjectId(service._id),
      quantity: element.quantity,
    })) as PaymentDetail[];
    const bulkResult = await this.paymentService.createPaymentDetail(details);

    service.paymentDetails = bulkResult.map((result) => result._id);
    await service.save();
  }

  @OnEvent(ServiceEvents.Paid, { async: true })
  async handlePaidService(
    service: ServiceDocument,
    cardId: string,
  ): Promise<void> {
    if (!cardId) {
      service.status = ServiceStatus.Completed;
      await service.save();
      return;
    }

    // TODO: Here we need to call the payment gateway for:
    // 1 - Apply a charge to the customer card

    const newPayment = new Payment();
    newPayment.escortId = new Types.ObjectId(service.escortId);
    newPayment.customerId = new Types.ObjectId(service.customerId);
    newPayment.serviceId = new Types.ObjectId(service._id);
    newPayment.cardId = new Types.ObjectId(cardId);
    await this.paymentService.create(newPayment);

    service.status = ServiceStatus.Completed;
    await service.save();
  }
}
