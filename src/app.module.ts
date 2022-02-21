import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CardModule } from './card/card.module';
import { CustomerBankAccountModule } from './customer-bank-account/customer-bank-account.module';
import { DevolutionModule } from './devolution/devolution.module';
import { EscortBankAccountModule } from './escort-bank-account/escort-bank-account.module';
import { PaymentModule } from './payment/payment.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
