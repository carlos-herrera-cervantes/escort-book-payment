import { ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageResponse } from '../common/dto/message-response.dto';
import { CreatePaymentMethodCatalogDTO, MethodsDTO } from './dto/create.dto';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentMethodCatalog } from './schemas/payment-method-catalog.schema';
import { UserPayment } from './schemas/user-payment.schema';

let eventEmitter: EventEmitter2;
let paymentService: PaymentService;
let paymentController: PaymentController;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: EventEmitter2,
        useValue: {
          emit: jest.fn(),
        },
      },
      {
        provide: PaymentService,
        useValue: {
          getPaymentMethods: jest.fn(),
          getLinkedPaymentMethods: jest.fn(),
          createPaymentMethod: jest.fn(),
          linkPaymentMethods: jest.fn(),
          softDeletePaymentMethod: jest.fn(),
          unlinkPaymentMethod: jest.fn(),
        },
      },
    ],
    controllers: [PaymentController],
  }).compile();

  eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  paymentService = module.get<PaymentService>(PaymentService);
  paymentController = module.get<PaymentController>(PaymentController);
});

describe('PaymentController', () => {
  it('Should be defined', () => expect(paymentController).toBeDefined());

  it('getPaymentMethods - Should return an empty list', async () => {
    const mockCallToGetPaymentMethods = jest
      .spyOn(paymentService, 'getPaymentMethods')
      .mockImplementation(() => Promise.resolve([]));

    const getResult: PaymentMethodCatalog[] = await paymentController.getPaymentMethods();

    expect(getResult.length).toBeFalsy();
    expect(mockCallToGetPaymentMethods).toBeCalledTimes(1);
  });

  it('getLinkedPaymentMethods - Should return an empty list', async () => {
    const req = { body: { user: { id: '637c69a24880516fac96dd77' } } };
    const mockCallToGetLinkedPaymentMethods = jest
      .spyOn(paymentService, 'getLinkedPaymentMethods')
      .mockImplementation(() => Promise.resolve([]));

    const getResult: UserPayment[] = await paymentController.getLinkedPaymentMethods(req);

    expect(getResult.length).toBeFalsy();
    expect(mockCallToGetLinkedPaymentMethods).toBeCalledTimes(1);
  });

  it('getLinkedPaymentMethodsByUser - Should return an empty list', async () => {
    const id = '637c6b3b0f7617b37b51a182';
    const mockCallToGetLinkedPaymentMethods = jest
      .spyOn(paymentService, 'getLinkedPaymentMethods')
      .mockImplementation(() => Promise.resolve([]));

    const getResult: UserPayment[] = await paymentController.getLinkedPaymentMethodsByUser(id);

    expect(getResult.length).toBeFalsy();
    expect(mockCallToGetLinkedPaymentMethods).toBeCalledTimes(1);
  });

  it('createPaymentMethod - Should throw conflict exception', async () => {
    const createPaymentMethodCatalog = new CreatePaymentMethodCatalogDTO();
    const mockCallToCreatePaymentMethod = jest
      .spyOn(paymentService, 'createPaymentMethod')
      .mockImplementation(() => Promise.reject('dummy error'));

    expect(async () => {
      await paymentController.createPaymentMethod(createPaymentMethodCatalog);
      expect(mockCallToCreatePaymentMethod).toBeCalledTimes(1);
    }).rejects.toThrow(ConflictException);
  });

  it('createPaymentMethod - Should create payment method', async () => {
    const createPaymentMethodCatalog = new CreatePaymentMethodCatalogDTO();
    const mockCallToCreatePaymentMethod = jest
      .spyOn(paymentService, 'createPaymentMethod')
      .mockImplementation(() => Promise.resolve(new PaymentMethodCatalog()));

    await paymentController.createPaymentMethod(createPaymentMethodCatalog);

    expect(mockCallToCreatePaymentMethod).toBeCalledTimes(1);
  });

  it('linkPaymentMethods - Should return a message response', async () => {
    const req = { body: { user: { id: '637c69a24880516fac96dd77' } } };
    const payments = new MethodsDTO();
    payments.methods = [];
    const mockCallToLinkPaymentMethods = jest
      .spyOn(paymentService, 'linkPaymentMethods')
      .mockImplementation(() => Promise.resolve([]));

    const linkResult: MessageResponse = await paymentController.linkPaymentMethods(req, payments);

    expect(linkResult.message).toEqual('OK');
    expect(mockCallToLinkPaymentMethods).toBeCalledTimes(1);
  });

  it('softDeletePaymentMethod - Should delete payment method', async () => {
    const id = '637c78b354c773db261b76f1';
    const mockCallToSoftDeletePaymentMethod = jest
      .spyOn(paymentService, 'softDeletePaymentMethod')
      .mockImplementation(() => Promise.resolve());
    const mockCallToEmit = jest.spyOn(eventEmitter, 'emit').mockImplementation(() => true);

    await paymentController.softDeletePaymentMethod(id);

    expect(mockCallToSoftDeletePaymentMethod).toBeCalledTimes(1);
    expect(mockCallToEmit).toBeCalledTimes(1);
  });

  it('unlinkPaymentMethod - Should unlink payment method', async () => {
    const id = '637c78b354c773db261b76f1';
    const mockCallToUnlinkPaymentMethod = jest
      .spyOn(paymentService, 'unlinkPaymentMethod')
      .mockImplementation(() => Promise.resolve());

    await paymentController.unlinkPaymentMethod(id);

    expect(mockCallToUnlinkPaymentMethod).toBeCalledTimes(1);
  });
});
