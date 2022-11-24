import { INestApplication } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DevolutionModule } from '../src/devolution/devolution.module';
import { MONGODB_URI } from '../src/config/mongo.config';
import { DevolutionService } from '../src/devolution/devolution.service';
import { Paginate } from '../src/common/dto/query-param.dto';
import { Devolution } from '../src/devolution/schemas/devolution.schema';
import { CreateDevolutionDTO } from '../src/devolution/dto/create.dto';

let app: INestApplication;
let devolutionService: DevolutionService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      EventEmitterModule.forRoot(),
      MongooseModule.forRoot(MONGODB_URI),
      DevolutionModule,
    ],
  }).compile();
  app = module.createNestApplication();
  await app.init();

  devolutionService = module.get<DevolutionService>(DevolutionService);
});

afterAll(async () => await app.close());

describe('DevolutionService', () => {
  it('getAll - Should return an empty list', async () => {
    const devolutions: Devolution[] = await devolutionService.getAll();
    expect(devolutions.length).toBeFalsy();
  });

  it('getByPagination - Should return an empty list', async () => {
    const paginate = new Paginate();
    paginate.offset = 0;
    paginate.limit = 10;

    const devolutions: Devolution[] = await devolutionService.getByPagination(paginate);

    expect(devolutions.length).toBeFalsy();
  });

  it('getOne - Should return null', async () => {
    const devolution: Devolution = await devolutionService.getOne();
    expect(devolution).toBeFalsy();
  });

  it('create - Should create a new devolution', async () => {
    const createDevolution = new CreateDevolutionDTO();
    createDevolution.customerId = '637bee54f34fdc1f0e8bb6fb';
    createDevolution.escortId = '637bee621cff15930def248f';
    createDevolution.serviceId = '637bee6fe17f77e061f8e066';

    await devolutionService.create(createDevolution);

    const counter: number = await devolutionService.count();
    expect(counter).toBeTruthy();

    await devolutionService.deleteMany();
  });
});
