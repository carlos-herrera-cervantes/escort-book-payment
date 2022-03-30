import { Inject, Injectable } from '@nestjs/common';
import { PaymentService } from '../payment.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Service } from '../../service/schemas/service.schema';
import { Types } from 'mongoose';
import { Payment } from '../schemas/payment.schema';

@Injectable()
export class ServicePaidListener {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent('service.paid', { async: true })
  async handlePaidService(service: Service): Promise<void> {
    const newPayment = new Payment();
    newPayment.escortId = new Types.ObjectId(service.escortId);
    newPayment.customerId = new Types.ObjectId(service.customerId);
    newPayment.serviceId = new Types.ObjectId(service._id);

    await this.paymentService.create(newPayment);
  }
}