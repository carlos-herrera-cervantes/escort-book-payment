import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceModule } from '../price/price.module';
import { EscortProfileModule } from '../escort-profile/escort-profile.module';
import { Service, ServiceSchema } from './schemas/service.schema';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { ServiceDetail, ServiceDetailSchema } from './schemas/service-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceDetail.name, schema: ServiceDetailSchema },
    ]),
    EscortProfileModule,
    PriceModule,
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [],
})
export class ServiceModule {}
