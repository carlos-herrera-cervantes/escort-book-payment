import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentService {
  @InjectModel(Payment.name)
  private readonly paymentModel: Model<PaymentDocument>;

  async create(payment: Payment): Promise<Payment> {
    return this.paymentModel.create(payment);
  }
}
