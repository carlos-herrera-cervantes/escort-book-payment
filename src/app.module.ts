import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CardModule } from './card/card.module';
import { CustomerBankAccountModule } from './customer-bank-account/customer-bank-account.module';
import { DevolutionModule } from './devolution/devolution.module';
import { EscortBankAccountModule } from './escort-bank-account/escort-bank-account.module';
import { PaymentModule } from './payment/payment.module';
import { ServiceModule } from './service/service.module';
import { EscortProfileModule } from './escort-profile/escort-profile.module';
import { PriceModule } from './price/price.module';
import { EscortProfile } from './escort-profile/entities/escort-profile.entity';
import { Price } from './price/entities/price.entity';
import { PriceDetail } from './price/entities/price-detail.entity';
import { MONGODB_URI } from './config/mongo.config';
import {
  ESCORT_PROFILE_HOST,
  ESCORT_PROFILE_PORT,
  ESCORT_PROFILE_USER,
  ESCORT_PROFILE_PASSWORD,
  ESCORT_PROFILE_DB,
} from './config/postgres.config';

@Module({
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
    CardModule,
    CustomerBankAccountModule,
    EscortBankAccountModule,
    DevolutionModule,
    PaymentModule,
    EscortProfileModule,
    PriceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
