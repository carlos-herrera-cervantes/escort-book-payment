import { INestApplication } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ESCORT_PROFILE_DB,
  ESCORT_PROFILE_HOST,
  ESCORT_PROFILE_PASSWORD,
  ESCORT_PROFILE_PORT,
  ESCORT_PROFILE_USER,
} from '../src/config/postgres.config';
import { PriceService } from '../src/price/price.service';
import { EscortProfile } from '../src/escort-profile/entities/escort-profile.entity';
import { Price } from '../src/price/entities/price.entity';
import { PriceDetail } from '../src/price/entities/price-detail.entity';
import { PriceModule } from '../src/price/price.module';

let app: INestApplication;
let priceService: PriceService;

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
        synchronize: true,
      }),
      PriceModule,
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  priceService = module.get<PriceService>(PriceService);
});

afterAll(async () => await app.close());

describe('PriceService', () => {
  it('findOne - Should return null', async () => {
    const price: Price = await priceService.findOne();
    expect(price).toBeFalsy();
  });

  it('countPriceDetail - Should return 0', async () => {
    const counter: number = await priceService.countPriceDetail();
    expect(counter).toBeFalsy();
  });
});
