import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { CardModule } from './card/card.module';
import { CustomerBankAccountModule } from './customer-bank-account/customer-bank-account.module';
import { DevolutionModule } from './devolution/devolution.module';
import { EscortBankAccountModule } from './escort-bank-account/escort-bank-account.module';
import { PaymentModule } from './payment/payment.module';
import { ServiceModule } from './service/service.module';
import { TypeOrmConfigService } from './config/type-orm-config.service';
import { EscortProfileModule } from './escort-profile/escort-profile.module';
import { PriceModule } from './price/price.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),
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
