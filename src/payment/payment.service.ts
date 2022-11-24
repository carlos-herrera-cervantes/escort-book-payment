import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import {
  PaymentMethodCatalog,
  PaymentMethodCatalogDocument,
} from './schemas/payment-method-catalog.schema';
import {
  UserPayment,
  UserPaymentDocument,
} from './schemas/user-payment.schema';
import {
  CreatePaymentMethodCatalogDTO,
  CreateUserPaymentDTO,
} from './dto/create.dto';
import { FilterQuery } from 'mongoose';
import {
  PaymentDetail,
  PaymentDetailDocument,
} from './schemas/payment-detail.schema';

@Injectable()
export class PaymentService {
  @InjectModel(Payment.name)
  private readonly paymentModel: Model<PaymentDocument>;

  @InjectModel(PaymentMethodCatalog.name)
  private readonly paymentMethodCatalogModel: Model<PaymentMethodCatalogDocument>;

  @InjectModel(UserPayment.name)
  private readonly userPaymentModel: Model<UserPaymentDocument>;

  @InjectModel(PaymentDetail.name)
  private readonly paymentDetailModel: Model<PaymentDetailDocument>;

  async create(payment: Payment): Promise<Payment> {
    return this.paymentModel.create(payment);
  }

  async createPaymentMethod(paymentMethodCatalog: CreatePaymentMethodCatalogDTO): Promise<PaymentMethodCatalog> {
    return this.paymentMethodCatalogModel.create(paymentMethodCatalog);
  }

  async createPaymentDetail(details: PaymentDetail[]): Promise<any> {
    return this.paymentDetailModel.insertMany(details);
  }

  async getPaymentDetails(filter?: FilterQuery<PaymentDetail>, populateFilter?: any): Promise<PaymentDetail[]> {
    return this.paymentDetailModel.find(filter).populate(populateFilter).lean();
  }

  async getPaymentMethods(filter?: FilterQuery<PaymentMethodCatalog>): Promise<PaymentMethodCatalog[]> {
    return this.paymentMethodCatalogModel.find(filter).lean();
  }

  async getPaymentMethod(filter?: FilterQuery<PaymentMethodCatalog>): Promise<PaymentMethodCatalog> {
    return this.paymentMethodCatalogModel.findOne(filter);
  }

  async getLinkedPaymentMethods(filter?: FilterQuery<UserPayment>, populateFilter?: any): Promise<UserPayment[]> {
    return this.userPaymentModel.find(filter).populate(populateFilter).lean();
  }

  async softDeletePaymentMethod(filter?: FilterQuery<PaymentMethodCatalog>): Promise<void> {
    const paymentMethod = await this.paymentMethodCatalogModel.findOne(filter);

    if (!paymentMethod) return;

    paymentMethod.deleted = true;
    await paymentMethod.save();
  }

  async linkPaymentMethods(paymentMethods: CreateUserPaymentDTO[]): Promise<UserPayment[]> {
    return this.userPaymentModel.create(paymentMethods);
  }

  async unlinkPaymentMethod(filter?: FilterQuery<UserPayment>): Promise<void> {
    await this.userPaymentModel.findOneAndDelete(filter);
  }

  async count(filter?: FilterQuery<Payment>): Promise<number> {
    return this.paymentModel.countDocuments(filter);
  }

  async countPaymentDetails(filter?: FilterQuery<PaymentDetail>): Promise<number> {
    return this.paymentDetailModel.countDocuments(filter);
  }

  async countLinkedPaymentMethods(filter?: FilterQuery<UserPayment>): Promise<number> {
    return this.userPaymentModel.count(filter);
  }

  async countPaymentMethods(filter?: FilterQuery<PaymentMethodCatalog>): Promise<number> {
    return this.paymentMethodCatalogModel.count(filter);
  }

  async deletePaymentMethods(filter?: FilterQuery<PaymentMethodCatalog>): Promise<void> {
    await this.paymentMethodCatalogModel.deleteMany(filter);
  }

  async deleteLinkedPaymentMethods(filter?: FilterQuery<UserPayment>): Promise<void> {
    await this.userPaymentModel.deleteMany(filter);
  }

  async deletePaymentDetails(filter?: FilterQuery<PaymentDetail>): Promise<void> {
    await this.paymentDetailModel.deleteMany(filter);
  }

  async deleteMany(filter?: FilterQuery<Payment>): Promise<void> {
    await this.paymentModel.deleteMany(filter);
  }
}
