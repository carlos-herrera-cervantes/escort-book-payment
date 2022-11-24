import { INestApplication } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Types } from 'mongoose';
import { ServiceModule } from '../src/service/service.module';
import { MONGODB_URI } from '../src/config/mongo.config';
import { ServiceRepository } from '../src/service/service.repository';
import { Paginate } from '../src/common/dto/query-param.dto';
import { Service } from '../src/service/schemas/service.schema';
import {
  ESCORT_PROFILE_DB,
  ESCORT_PROFILE_HOST,
  ESCORT_PROFILE_PASSWORD,
  ESCORT_PROFILE_PORT,
  ESCORT_PROFILE_USER,
} from '../src/config/postgres.config';
import { EscortProfile } from '../src/escort-profile/entities/escort-profile.entity';
import { Price } from '../src/price/entities/price.entity';
import { PriceDetail } from '../src/price/entities/price-detail.entity';
import { CreateServiceDetail } from '../src/service/dto/create.dto';

let app: INestApplication;
let serviceRepository: ServiceRepository;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      EventEmitterModule.forRoot(),
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: ESCORT_PROFILE_HOST,
        port: Number(ESCORT_PROFILE_PORT),
        username: ESCORT_PROFILE_USER,
        password: ESCORT_PROFILE_PASSWORD,
        database: ESCORT_PROFILE_DB,
        entities: [EscortProfile, Price, PriceDetail],
        synchronize: false,
      }),
      MongooseModule.forRoot(MONGODB_URI),
      ServiceModule,
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  serviceRepository = module.get<ServiceRepository>(ServiceRepository);
});

afterAll(async () => await app.close());

afterEach(async () => await Promise.all([
  serviceRepository.deleteMany(),
  serviceRepository.deleteDetails(),
]));

describe('ServiceRepository', () => {
  it('getByPagination - Should return empty list', async () => {
    const services: Service[] = await serviceRepository.getByPagination(new Paginate());
    expect(services).toEqual([]);
  });

  it('getOneAndPopulate - Should return null', async () => {
    const service: Service | null = await serviceRepository.getOneAndPopulate({});
    expect(service).toBeFalsy();
  });

  it('create - Should create a new service', async () => {
    const service = new Service();
    service.customerId = new Types.ObjectId('637ef46c1202b57dec8c2ac9');
    service.escortId = new Types.ObjectId('637ef49613d51016a13ee5ac');
    service.price = 800;
    service.businessCommission = 80;
    service.timeQuantity = 1;
    service.timeMeasurementUnit = 'h';
    service.details = [new Types.ObjectId()];
    service.paymentDetails = [new Types.ObjectId()];

    await serviceRepository.create(service);

    const counter: number = await serviceRepository.count();
    expect(counter).toBeTruthy();
  });

  it('createBatchDetail - Should create a group of details', async () => {
    const createServiceDetail = new CreateServiceDetail();
    createServiceDetail.serviceId = '637efc1e6cc62b434ec6c5ff';
    createServiceDetail.serviceName = 'Test service';
    createServiceDetail.cost = 800;
    const serviceDetailBatch = [createServiceDetail];

    await serviceRepository.createBatchDetail(serviceDetailBatch);

    const counter: number = await serviceRepository.countDetails();
    expect(counter).toBeTruthy();
  });
});
