import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { PriceService } from '../price/price.service';
import { EscortProfileService } from '../escort-profile/escort-profile.service';
import { ServiceRepository } from './service.repository';
import { CardService } from '../card/card.service';
import { ServiceController } from './service.controller';
import { PaymentService } from '../payment/payment.service';
import { EscortProfile } from '../escort-profile/entities/escort-profile.entity';
import { Paginate } from '../common/dto/query-param.dto';
import { Pager } from '../common/helpers/pager';
import { ListServiceDTO, ListTotal } from './dto/list.dto';
import { Service } from './schemas/service.schema';
import { CalculateTotalService, CreatePaymentDetail, CreateService, CreateServiceDetail } from './dto/create.dto';
import { TimeUnit } from './enums/time-unit.enum';
import { Price } from '../price/entities/price.entity';
import { UpdateService } from './dto/update.dto';

let serviceService: ServiceRepository;
let escortProfileService: EscortProfileService;
let priceService: PriceService;
let eventEmitter: EventEmitter2;
let cardService: CardService;
let serviceController: ServiceController;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: ServiceRepository,
        useValue: {
          getByPagination: jest.fn(),
          count: jest.fn(),
          getOneAndPopulate: jest.fn(),
          createBatchDetail: jest.fn(),
          create: jest.fn(),
        },
      },
      {
        provide: EscortProfileService,
        useValue: {
          findOne: jest.fn(),
        },
      },
      {
        provide: PriceService,
        useValue: {
          findOne: jest.fn(),
          countPriceDetail: jest.fn(),
        },
      },
      {
        provide: EventEmitter2,
        useValue: {
          emit: jest.fn(),
        },
      },
      {
        provide: CardService,
        useValue: {
          count: jest.fn(),
        },
      },
      {
        provide: PaymentService,
        useValue: {},
      },
    ],
    controllers: [ServiceController],
  }).compile();

  serviceService = module.get<ServiceRepository>(ServiceRepository);
  escortProfileService = module.get<EscortProfileService>(EscortProfileService);
  priceService = module.get<PriceService>(PriceService);
  eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  cardService = module.get<CardService>(CardService);
  serviceController = module.get<ServiceController>(ServiceController);
});

describe('ServiceController', () => {
  it('Should be defined', () => expect(serviceController).toBeDefined());

  it('getByPagination - Should return pagination result', async () => {
    const mockCallToGetByPagination = jest
      .spyOn(serviceService, 'getByPagination')
      .mockImplementation(() => Promise.resolve([]));
    const mockCallToCount = jest
      .spyOn(serviceService, 'count')
      .mockImplementation(() => Promise.resolve(0));
    const mockCallToFindOne = jest
      .spyOn(escortProfileService, 'findOne')
      .mockImplementation(() => Promise.resolve(new EscortProfile()));

    const paginate = new Paginate();
    const userId = "637d95b1a95cfc683062943b";
    const userType = "Customer";

    const paginationResult: Pager<ListServiceDTO> = await serviceController.getByPagination(paginate, userId, userType);

    expect(paginationResult.total).toBeFalsy();
    expect(paginationResult.data).toEqual([]);
    expect(paginationResult.page).toBeFalsy();
    expect(paginationResult.pageSize).toEqual(10);
    expect(paginationResult.hasNext).toBeFalsy();
    expect(paginationResult.hasPrevious).toBeFalsy();
    expect(mockCallToGetByPagination).toBeCalledTimes(1);
    expect(mockCallToCount).toBeCalledTimes(1);
    expect(mockCallToFindOne).toBeCalledTimes(0);
  });

  it('getById - Should throw not found exception', async () => {
    const mockCallToGetOneAndPopulate = jest
      .spyOn(serviceService, 'getOneAndPopulate')
      .mockImplementation(() => Promise.resolve(null));

    const serviceId = '637d9dfc7fad9f38f131e3b4';
    const userId = '637d95b1a95cfc683062943b';

    expect(async () => {
      await serviceController.getById(serviceId, userId);
      expect(mockCallToGetOneAndPopulate).toBeCalledTimes(1);
    }).rejects.toThrow(NotFoundException);
  });

  it('getById - Should return a service', async () => {
    const service = new Service();
    service._id = '637d9dfc7fad9f38f131e3b4';
    service.escortId = new Types.ObjectId('637da1b2595c5fb6846ded78');
    service.status = 'Completed';
    service.price = 800;
    service.timeQuantity = 1;
    service.timeMeasurementUnit = 'h';
    service.createdAt = new Date();
    service.updatedAt = new Date();
    service.details = [];
    service.paymentDetails = [];
    const mockCallToGetOneAndPopulate = jest
      .spyOn(serviceService, 'getOneAndPopulate')
      .mockImplementation(() => Promise.resolve(service));

    const escortProfile = new EscortProfile();
    escortProfile.firstName = 'Test';
    escortProfile.lastName = 'Escort';
    escortProfile.escortId = '637da1b2595c5fb6846ded78';
    const mockCallToFindOne = jest
      .spyOn(escortProfileService, 'findOne')
      .mockImplementation(() => Promise.resolve(escortProfile));

    const userId = '637d95b1a95cfc683062943b';
    const serviceId = '637d9dfc7fad9f38f131e3b4';

    await serviceController.getById(serviceId, userId);

    expect(mockCallToGetOneAndPopulate).toBeCalledTimes(1);
    expect(mockCallToFindOne).toBeCalledTimes(1);
  });

  it('calculateTotal - Should throw not found exception when price does not exist', async () => {
    const mockCallToFindOne = jest
      .spyOn(priceService, 'findOne')
      .mockImplementation(() => Promise.resolve(null));

    const calculateTotalService = new CalculateTotalService();
    calculateTotalService.priceId = '90817a9e-4afb-458c-bbcc-431dcea75555';
    calculateTotalService.timeQuantity = 1;
    calculateTotalService.timeMeasurementUnit = TimeUnit.Hour;

    expect(async () => {
      await serviceController.calculateTotal(calculateTotalService);
      expect(mockCallToFindOne).toBeCalledTimes(1);
    }).rejects.toThrow(NotFoundException);
  });

  it('calculateTotal - Should throw bad request exception when time quantity is less than price quantity', async () => {
    const price = new Price();
    price.quantity = 1;
    const mockCallToFindOne = jest
      .spyOn(priceService, 'findOne')
      .mockImplementation(() => Promise.resolve(price));

    const calculateTotalService = new CalculateTotalService();
    calculateTotalService.priceId = '90817a9e-4afb-458c-bbcc-431dcea75555';
    calculateTotalService.timeQuantity = 0.5;
    calculateTotalService.timeMeasurementUnit = TimeUnit.Hour;

    expect(async () => {
      await serviceController.calculateTotal(calculateTotalService);
      expect(mockCallToFindOne).toBeCalledTimes(1);
    }).rejects.toThrow(BadRequestException);
  });

  it('calculateTotal - Should throw not foun exception when a service does not exist', async () => {
    const price = new Price();
    price.quantity = 1;
    const mockCallToFindOne = jest
      .spyOn(priceService, 'findOne')
      .mockImplementation(() => Promise.resolve(price));

    const mockCallToCountPriceDetail = jest
      .spyOn(priceService, 'countPriceDetail')
      .mockImplementation(() => Promise.resolve(2));

    const calculateTotalService = new CalculateTotalService();
    calculateTotalService.priceId = '90817a9e-4afb-458c-bbcc-431dcea75555';
    calculateTotalService.timeQuantity = 1;
    calculateTotalService.timeMeasurementUnit = TimeUnit.Hour;

    expect(async () => {
      await serviceController.calculateTotal(calculateTotalService);
      expect(mockCallToFindOne).toBeCalledTimes(1);
      expect(mockCallToCountPriceDetail).toBeCalledTimes(1);
    }).rejects.toThrow(NotFoundException);
  });

  it('calculateTotal - Should return total for service', async () => {
    const price = new Price();
    price.quantity = 1;
    price.cost = 800;
    const mockCallToFindOne = jest
      .spyOn(priceService, 'findOne')
      .mockImplementation(() => Promise.resolve(price));

    const mockCallToCountPriceDetail = jest
      .spyOn(priceService, 'countPriceDetail')
      .mockImplementation(() => Promise.resolve(1));

    const createServiceDetail = new CreateServiceDetail();
    createServiceDetail.serviceId = '637dce738060d802bcc1d36c';
    createServiceDetail.serviceName = 'Dummy service';
    createServiceDetail.cost = 0;

    const calculateTotalService = new CalculateTotalService();
    calculateTotalService.priceId = '90817a9e-4afb-458c-bbcc-431dcea75555';
    calculateTotalService.timeQuantity = 1;
    calculateTotalService.timeMeasurementUnit = TimeUnit.Hour;
    calculateTotalService.details = [createServiceDetail];

    const totalResult: ListTotal = await serviceController.calculateTotal(calculateTotalService);

    expect(totalResult.total).toEqual(880);
    expect(mockCallToFindOne).toBeCalledTimes(1);
    expect(mockCallToCountPriceDetail).toBeCalledTimes(1);
  });

  it('create - Should throw not found exception', async () => {
    const mockCallToFindOne = jest
      .spyOn(priceService, 'findOne')
      .mockImplementation(() => Promise.resolve(null));

    const userId = '637d95b1a95cfc683062943b';
    const createService = new CreateService();

    expect(async () => {
      await serviceController.create(createService, userId);
      expect(mockCallToFindOne).toBeCalledTimes(1);
    }).rejects.toThrow(NotFoundException);
  });

  it('create - Should throw bad request exception', async () => {
    const price = new Price();
    price.quantity = 1;
    const mockCallToFindOne = jest
      .spyOn(priceService, 'findOne')
      .mockImplementation(() => Promise.resolve(price));

    const userId = '637d95b1a95cfc683062943b';
    const createService = new CreateService();
    createService.timeQuantity = 0.5;

    expect(async () => {
      await serviceController.create(createService, userId);
      expect(mockCallToFindOne).toBeCalledTimes(1);
    }).rejects.toThrow(BadRequestException);
  });

  it('create - Should throw bad request exception when payment is less than total to pay', async () => {
    const price = new Price();
    price.quantity = 1;
    price.cost = 800;
    const mockCallToFindOne = jest
      .spyOn(priceService, 'findOne')
      .mockImplementation(() => Promise.resolve(price));

    const mockCallToCreateBatchDetail = jest
      .spyOn(serviceService, 'createBatchDetail')
      .mockImplementation(() => Promise.resolve([]));

    const userId = '637d95b1a95cfc683062943b';
    const createService = new CreateService();
    createService.priceId = '06901296-0d90-4b89-9700-ef53771c52d4';
    createService.customerId = '637ed427c4ee33ccb11fea5b';
    createService.escortId = '637ed43d270e3e445663434f';
    createService.timeQuantity = 1;
    createService.timeMeasurementUnit = TimeUnit.Hour;
    createService.details = [];
    createService.paymentDetails = [];

    expect(async () => {
      await serviceController.create(createService, userId);
      expect(mockCallToFindOne).toBeCalledTimes(1);
      expect(mockCallToCreateBatchDetail).toBeCalledTimes(1);
    }).rejects.toThrow(BadRequestException);
  });

  it('create - Should create a payment', async () => {
    const price = new Price();
    price.quantity = 1;
    price.cost = 800;
    const mockCallToFindOne = jest
      .spyOn(priceService, 'findOne')
      .mockImplementation(() => Promise.resolve(price));

    const mockCallToCreateBatchDetail = jest
      .spyOn(serviceService, 'createBatchDetail')
      .mockImplementation(() => Promise.resolve([]));

    const mockCallToEmit = jest
      .spyOn(eventEmitter, 'emit')
      .mockImplementation(() => true);

    const userId = '637d95b1a95cfc683062943b';
    const createPaymentDetail = new CreatePaymentDetail();
    createPaymentDetail.quantity = 880;
    const createService = new CreateService();
    createService.priceId = '06901296-0d90-4b89-9700-ef53771c52d4';
    createService.customerId = '637ed427c4ee33ccb11fea5b';
    createService.escortId = '637ed43d270e3e445663434f';
    createService.timeQuantity = 1;
    createService.timeMeasurementUnit = TimeUnit.Hour;
    createService.details = [];
    createService.paymentDetails = [createPaymentDetail];

    await serviceController.create(createService, userId);

    expect(mockCallToFindOne).toBeCalledTimes(1);
    expect(mockCallToCreateBatchDetail).toBeCalledTimes(1);
    expect(mockCallToEmit).toBeCalledTimes(1);
  });

  it('startService - Should throw not found exception', async () => {
    const mockCallToGetOneAndPopulate = jest
      .spyOn(serviceService, 'getOneAndPopulate')
      .mockImplementation(() => Promise.resolve(null));

    const userId = '637d95b1a95cfc683062943b';
    const serviceId = '637ed9c09c4269a853ace73f';

    expect(async () => {
      await serviceController.startService(userId, serviceId);
      expect(mockCallToGetOneAndPopulate).toBeCalledTimes(1);
    }).rejects.toThrow(NotFoundException);
  });

  it('startService - Should throw forbidden exception', async () => {
    const service = new Service();
    service.escortId = new Types.ObjectId('637edaf1189c9b403612dd0f');
    const mockCallToGetOneAndPopulate = jest
      .spyOn(serviceService, 'getOneAndPopulate')
      .mockImplementation(() => Promise.resolve(service));

    const userId = '637d95b1a95cfc683062943b';
    const serviceId = '637ed9c09c4269a853ace73f';

    expect(async () => {
      await serviceController.startService(userId, serviceId);
      expect(mockCallToGetOneAndPopulate).toBeCalledTimes(1);
    }).rejects.toThrow(ForbiddenException);
  });

  it('startService - Should throw bad request exception', async () => {
    const service = new Service();
    service.escortId = new Types.ObjectId('637d95b1a95cfc683062943b');
    service.status = 'completed';
    const mockCallToGetOneAndPopulate = jest
      .spyOn(serviceService, 'getOneAndPopulate')
      .mockImplementation(() => Promise.resolve(service));

    const userId = '637d95b1a95cfc683062943b';
    const serviceId = '637ed9c09c4269a853ace73f';

    expect(async () => {
      await serviceController.startService(userId, serviceId);
      expect(mockCallToGetOneAndPopulate).toBeCalledTimes(1);
    }).rejects.toThrow(BadRequestException);
  });

  it('startService - Should return message response', async () => {
    const service = new Service();
    service.escortId = new Types.ObjectId('637d95b1a95cfc683062943b');
    service.status = 'boarding';
    const mockCallToGetOneAndPopulate = jest
      .spyOn(serviceService, 'getOneAndPopulate')
      .mockImplementation(() => Promise.resolve(service));

    const mockCallToEmit = jest
      .spyOn(eventEmitter, 'emit')
      .mockImplementation(() => true);

    const userId = '637d95b1a95cfc683062943b';
    const serviceId = '637ed9c09c4269a853ace73f';

    await serviceController.startService(userId, serviceId);

    expect(mockCallToGetOneAndPopulate).toBeCalledTimes(1);
    expect(mockCallToEmit).toBeCalledTimes(1);
  });

  it('payService - Should throw not found exception when service does not exists', async () => {
    const mockCallToGetOneAndPopulate = jest
      .spyOn(serviceService, 'getOneAndPopulate')
      .mockImplementation(() => Promise.resolve(null));

    const updateService = new UpdateService();
    const userId = '637d95b1a95cfc683062943b';
    const serviceId = '637ed9c09c4269a853ace73f';

    expect(async () => {
      await serviceController.payService(updateService, userId, serviceId);
      expect(mockCallToGetOneAndPopulate).toBeCalledTimes(1);
    }).rejects.toThrow(NotFoundException);
  });

  it('payService - Should throw bad request exception when service is not started', async () => {
    const service = new Service();
    service.status = 'completed';
    const mockCallToGetOneAndPopulate = jest
      .spyOn(serviceService, 'getOneAndPopulate')
      .mockImplementation(() => Promise.resolve(service));

    const updateService = new UpdateService();
    const userId = '637d95b1a95cfc683062943b';
    const serviceId = '637ed9c09c4269a853ace73f';

    expect(async () => {
      await serviceController.payService(updateService, userId, serviceId);
      expect(mockCallToGetOneAndPopulate).toBeCalledTimes(1);
    }).rejects.toThrow(BadRequestException);
  });

  it('payService - Should throw not found exception when card does not exists', async () => {
    const service = new Service();
    service.status = 'started';
    service.paymentDetails = []
    const mockCallToGetOneAndPopulate = jest
      .spyOn(serviceService, 'getOneAndPopulate')
      .mockImplementation(() => Promise.resolve(service));

    const mockCallToCount = jest
      .spyOn(cardService, 'count')
      .mockImplementation(() => Promise.resolve(0))

    const updateService = new UpdateService();
    updateService.cardId = '637ee3334cae88a16f6bd4f5';
    const userId = '637d95b1a95cfc683062943b';
    const serviceId = '637ed9c09c4269a853ace73f';

    expect(async () => {
      await serviceController.payService(updateService, userId, serviceId);
      expect(mockCallToGetOneAndPopulate).toBeCalledTimes(1);
      expect(mockCallToCount).toBeCalledTimes(1);
    }).rejects.toThrow(NotFoundException);
  });

  it('payService - Should return message response', async () => {
    const service = new Service();
    service.status = 'started';
    const mockCallToGetOneAndPopulate = jest
      .spyOn(serviceService, 'getOneAndPopulate')
      .mockImplementation(() => Promise.resolve(service));

    const mockCallToEmit = jest
      .spyOn(eventEmitter, 'emit')
      .mockImplementation(() => true);

    const updateService = new UpdateService();
    const userId = '637d95b1a95cfc683062943b';
    const serviceId = '637ed9c09c4269a853ace73f';

    await serviceController.payService(updateService, userId, serviceId);
    expect(mockCallToGetOneAndPopulate).toBeCalledTimes(1);
    expect(mockCallToEmit).toBeCalledTimes(1);
  });
});
