import { INestApplication } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types, FilterQuery } from 'mongoose';
import { PaymentModule } from '../src/payment/payment.module';
import { MONGODB_URI } from '../src/config/mongo.config';
import { PaymentService } from '../src/payment/payment.service';
import { Payment } from '../src/payment/schemas/payment.schema';
import { PaymentDetail } from '../src/payment/schemas/payment-detail.schema';
import { CreatePaymentMethodCatalogDTO, CreateUserPaymentDTO } from '../src/payment/dto/create.dto';
import { PaymentMethodCatalog } from '../src/payment/schemas/payment-method-catalog.schema';
import { UserPayment } from '../src/payment/schemas/user-payment.schema';

let app: INestApplication;
let paymentService: PaymentService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      EventEmitterModule.forRoot(),
      MongooseModule.forRoot(MONGODB_URI),
      PaymentModule,
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  paymentService = module.get<PaymentService>(PaymentService);
});

afterAll(async () => await app.close());

describe('PaymentService', () => {
  it('create - Should create a payment', async () => {
    const payment = new Payment();
    payment.escortId = new Types.ObjectId('637c7f8aa179219a0468984d');
    payment.customerId = new Types.ObjectId('637c7f9cbb7930f6953c4c06');
    payment.serviceId = new Types.ObjectId('637c7fb9d5ca9507b70abc83');
    payment.cardId = new Types.ObjectId('637c7fc6d5370bdde9556bda');

    await paymentService.create(payment);

    const counter: number = await paymentService.count();
    expect(counter).toBeTruthy();

    await paymentService.deleteMany();
  });

  it('createPaymentMethod - Should create payment method', async () => {
    const createPaymentMethodCatalog = new CreatePaymentMethodCatalogDTO();
    createPaymentMethodCatalog.name = 'Test payment';
    createPaymentMethodCatalog.description = 'This is a test payment';

    await paymentService.createPaymentMethod(createPaymentMethodCatalog);

    const counter: number = await paymentService.countPaymentMethods();
    expect(counter).toBeTruthy();

    await paymentService.deletePaymentMethods();
  });

  it('createPaymentDetail - Should create payment details', async () => {
    const paymentDetail = new PaymentDetail();
    paymentDetail.paymentMethodId = new Types.ObjectId('637d104c95c8e8f8a12bf87a');
    paymentDetail.serviceId = new Types.ObjectId('637d109735eb9fffcf859e58');
    paymentDetail.cardId = new Types.ObjectId('637d11386050a2d75d4e12f4');
    paymentDetail.quantity = 100;
    const paymentDetails = [paymentDetail];

    await paymentService.createPaymentDetail(paymentDetails);

    const counter: number = await paymentService.countPaymentDetails();
    expect(counter).toBeTruthy();

    await paymentService.deletePaymentDetails();
  });

  it('getPaymentDetails - Should return a empty list', async () => {
    const paymentDetails: PaymentDetail[] = await paymentService.getPaymentDetails();
    expect(paymentDetails.length).toBeFalsy();
  });

  it('getPaymentMethods - Should return an empty list', async () => {
    const paymentMethods: PaymentMethodCatalog[] = await paymentService.getPaymentMethods();
    expect(paymentMethods.length).toBeFalsy();
  });

  it('getPaymentMethod - Should return null', async () => {
    const paymentMethod: PaymentMethodCatalog = await paymentService.getPaymentMethod();
    expect(paymentMethod).toBeFalsy();
  });

  it('getLinkedPaymentMethods - Should return an empty list', async () => {
    const userPayments: UserPayment[] = await paymentService.getLinkedPaymentMethods();
    expect(userPayments.length).toBeFalsy();
  });

  it('softDeletePaymentMethod - Should change the deleted property to true', async () => {
    const paymentMethodCatalog = new PaymentMethodCatalog();
    paymentMethodCatalog.name = 'Test payment method';
    paymentMethodCatalog.description = 'This is a test payment method';

    const createResult: PaymentMethodCatalog = await paymentService.createPaymentMethod(paymentMethodCatalog);

    const filter: FilterQuery<PaymentMethodCatalog> = { _id: createResult._id };
    await paymentService.softDeletePaymentMethod(filter);

    const getResult: PaymentMethodCatalog = await paymentService.getPaymentMethod(filter);
    expect(getResult.deleted).toBeTruthy();

    await paymentService.deletePaymentMethods();
  });

  it('linkPaymentMethods - Should link payment method for user', async () => {
    const createUserPayment = new CreateUserPaymentDTO();
    createUserPayment.paymentMethodId = '637d1ec1fa2d1bd027a83fc8';
    createUserPayment.userId = '637d1ed340cedb1c7ed9e1ad';
    const userPayments = [createUserPayment];

    await paymentService.linkPaymentMethods(userPayments);

    const counter: number = await paymentService.countLinkedPaymentMethods();
    expect(counter).toBeTruthy();

    await paymentService.deleteLinkedPaymentMethods();
  });

  it('unlinkPaymentMethod - Should unlink payment method for user', async () => {
    const createUserPayment = new CreateUserPaymentDTO();
    createUserPayment.paymentMethodId = '637d1ec1fa2d1bd027a83fc8';
    createUserPayment.userId = '637d1ed340cedb1c7ed9e1ad';
    const userPayments = [createUserPayment];

    await paymentService.linkPaymentMethods(userPayments);

    const counterBeforeDelete: number = await paymentService.countLinkedPaymentMethods();
    expect(counterBeforeDelete).toBeTruthy();

    await paymentService.unlinkPaymentMethod({
      userId: '637d1ed340cedb1c7ed9e1ad',
      paymentMethodId: '637d1ec1fa2d1bd027a83fc8',
    });

    const counterAfterDelete: number = await paymentService.countLinkedPaymentMethods();
    expect(counterAfterDelete).toBeFalsy();
  });

  it('count - Should return 0 documents', async () => {
    const counter: number = await paymentService.count();
    expect(counter).toBeFalsy();
  });

  it('countPaymentDetails - Should return 0 documents', async () => {
    const counter: number = await paymentService.countPaymentDetails();
    expect(counter).toBeFalsy();
  });

  it('countLinkedPaymentMethods - Should return 0 documents', async () => {
    const counter: number = await paymentService.countLinkedPaymentMethods();
    expect(counter).toBeFalsy();
  });

  it('countPaymentMethods - Should return 0 documents', async () => {
    const counter: number = await paymentService.countPaymentMethods();
    expect(counter).toBeFalsy();
  });

  it('deletePaymentMethods - Should delete payment methods', async () => {
    const createPaymentMethodCatalog = new CreatePaymentMethodCatalogDTO();
    createPaymentMethodCatalog.name = 'Test payment';
    createPaymentMethodCatalog.description = 'This is a payment';

    await paymentService.createPaymentMethod(createPaymentMethodCatalog);

    const counterBeforeDelete: number = await paymentService.countPaymentMethods();
    expect(counterBeforeDelete).toBeTruthy();

    await paymentService.deletePaymentMethods();

    const counterAfterDelete: number = await paymentService.countPaymentMethods();
    expect(counterAfterDelete).toBeFalsy();
  });

  it('deleteLinkedPaymentMethods - Should delete linked payment method', async () => {
    const createUserPayment = new CreateUserPaymentDTO();
    createUserPayment.paymentMethodId = '637d1ec1fa2d1bd027a83fc8';
    createUserPayment.userId = '637d1ed340cedb1c7ed9e1ad';
    const userPayments = [createUserPayment];

    await paymentService.linkPaymentMethods(userPayments);

    const counterBeforeDelete: number = await paymentService.countLinkedPaymentMethods();
    expect(counterBeforeDelete).toBeTruthy();

    await paymentService.deleteLinkedPaymentMethods();

    const counterAfterDelete: number = await paymentService.countLinkedPaymentMethods();
    expect(counterAfterDelete).toBeFalsy();
  });

  it('deletePaymentDetails - Should delete payment details', async () => {
    const paymentDetail = new PaymentDetail();
    paymentDetail.paymentMethodId = new Types.ObjectId('637d104c95c8e8f8a12bf87a');
    paymentDetail.serviceId = new Types.ObjectId('637d109735eb9fffcf859e58');
    paymentDetail.cardId = new Types.ObjectId('637d11386050a2d75d4e12f4');
    paymentDetail.quantity = 100;
    const paymentDetails = [paymentDetail];

    await paymentService.createPaymentDetail(paymentDetails);

    const counterBeforeDelete: number = await paymentService.countPaymentDetails();
    expect(counterBeforeDelete).toBeTruthy();

    await paymentService.deletePaymentDetails();

    const counterAfterDelete: number = await paymentService.countPaymentDetails();
    expect(counterAfterDelete).toBeFalsy();
  });
});
