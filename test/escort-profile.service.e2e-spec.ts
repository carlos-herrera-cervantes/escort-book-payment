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
import { EscortProfileService } from '../src/escort-profile/escort-profile.service';
import { EscortProfile } from '../src/escort-profile/entities/escort-profile.entity';
import { Price } from '../src/price/entities/price.entity';
import { PriceDetail } from '../src/price/entities/price-detail.entity';
import { EscortProfileModule } from '../src/escort-profile/escort-profile.module';

let app: INestApplication;
let escortProfileService: EscortProfileService;

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
      EscortProfileModule,
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  escortProfileService = module.get<EscortProfileService>(EscortProfileService);
});

afterAll(async () => await app.close());

describe('EscortProfileService', () => {
  it('findOne - Should return null', async () => {
    const profile: EscortProfile = await escortProfileService.findOne();
    expect(profile).toBeFalsy();
  });

  it('count - Should return 0', async () => {
    const counter: number = await escortProfileService.count();
    expect(counter).toBeFalsy();
  });
});
