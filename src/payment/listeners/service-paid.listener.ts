import { Inject, Injectable } from '@nestjs/common';
import { PaymentService } from '../payment.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceDocument } from '../../service/schemas/service.schema';
import { Types } from 'mongoose';
import { Payment } from '../schemas/payment.schema';
import { ServiceStatus } from '../../service/enums/status.enum';
import { ServiceEvents } from '../../config/event.config';

@Injectable()
export class ServicePaidListener {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

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
