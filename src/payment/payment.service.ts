import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { PaymentMethodCatalog, PaymentMethodCatalogDocument } from './schemas/payment-method-catalog.schema';
import { PaymentUser, PaymentUserDocument } from './schemas/payment-user.schema';
import { CreatePaymentMethodCatalogDTO, CreatePaymentUserDTO } from './dto/create.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class PaymentService {
  @InjectModel(Payment.name)
  private readonly paymentModel: Model<PaymentDocument>;

  @InjectModel(PaymentMethodCatalog.name)
  private readonly paymentMethodCatalogModel: Model<PaymentMethodCatalogDocument>;

  @InjectModel(PaymentUser.name)
  private readonly paymentUserModel: Model<PaymentUserDocument>;

  async create(payment: Payment): Promise<Payment> {
    return this.paymentModel.create(payment);
  }

  async createPaymentMethod(
    paymentMethodCatalog: CreatePaymentMethodCatalogDTO,
  ): Promise<PaymentMethodCatalog> {
    return this.paymentMethodCatalogModel.create(paymentMethodCatalog);
  }

  async getPaymentMethods(filter?: FilterQuery<PaymentMethodCatalog>): Promise<PaymentMethodCatalog[]> {
    return this.paymentMethodCatalogModel.find(filter).lean();
  }

  async getPaymentMethod(filter?: FilterQuery<PaymentMethodCatalog>): Promise<PaymentMethodCatalog> {
    return this.paymentMethodCatalogModel.findOne(filter);
  }

  async getLinkedPaymentMethods(
    filter?: FilterQuery<PaymentUser>,
    populateFilter?: any,
  ): Promise<PaymentUser> {
    return this.paymentUserModel.find(filter).populate(populateFilter).lean();
  }

  async softDeletePaymentMethod(filter?: FilterQuery<PaymentMethodCatalog>): Promise<void> {
    const paymentMethod = await this.paymentMethodCatalogModel.findOne(filter);

    if (!paymentMethod) return;

    paymentMethod.deleted = true;
    await paymentMethod.save();
  }

  async linkPaymentMethods(paymentMethods: CreatePaymentUserDTO[]): Promise<PaymentUser[]> {
    return this.paymentUserModel.create(paymentMethods);
  }

  async unlinkPaymentMethod(filter?: FilterQuery<PaymentUser>): Promise<void> {
    await this.paymentUserModel.findOneAndDelete(filter);
  }

  async countLinkedPaymentMethods(filter?: FilterQuery<PaymentUser>): Promise<number> {
    return this.paymentUserModel.count(filter);
  }

  async countPaymentMethods(filter?: FilterQuery<PaymentMethodCatalog>): Promise<number> {
    return this.paymentMethodCatalogModel.count(filter);
  }
}
