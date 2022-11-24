import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PriceModule } from '../price/price.module';
import { EscortProfileModule } from '../escort-profile/escort-profile.module';
import { Service, ServiceSchema } from './schemas/service.schema';
import { ServiceController } from './service.controller';
import { ServiceRepository } from './service.repository';
import {
  ServiceDetail,
  ServiceDetailSchema,
} from './schemas/service-detail.schema';
import { CardModule } from '../card/card.module';
import { PaymentModule } from '../payment/payment.module';
import { ServiceListener } from './listeners/service.listener';
import { KAFKA_BROKERS } from '../config/kafka.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EscortBookPayment',
        transport: Transport.KAFKA,
        options: {
          client: { clientId: 'Payment', brokers: [KAFKA_BROKERS] },
        },
      }
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
  providers: [ServiceListener, ServiceRepository],
  controllers: [ServiceController],
  exports: [],
})
export class ServiceModule {}
