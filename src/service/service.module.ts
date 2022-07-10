import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceModule } from '../price/price.module';
import { EscortProfileModule } from '../escort-profile/escort-profile.module';
import { Service, ServiceSchema } from './schemas/service.schema';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import {
  ServiceDetail,
  ServiceDetailSchema,
} from './schemas/service-detail.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CardModule } from '../card/card.module';
import { PaymentModule } from '../payment/payment.module';
import { ServiceListener } from './listeners/service.listener';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'EscortBookPayment',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'Payment',
              brokers: [configService.get<string>('BROKERS')],
            },
          },
        }),
      },
    ]),
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceDetail.name, schema: ServiceDetailSchema },
    ]),
    EscortProfileModule,
    PriceModule,
    CardModule,
    PaymentModule,
  ],
  providers: [ServiceListener, ServiceService],
  controllers: [ServiceController],
  exports: [],
})
export class ServiceModule {}
