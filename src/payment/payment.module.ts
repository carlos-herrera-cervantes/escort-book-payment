import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import {
  PaymentMethodCatalog,
  PaymentMethodCatalogSchema,
} from './schemas/payment-method-catalog.schema';
import { PaymentUser, PaymentUserSchema } from './schemas/payment-user.schema';
import { PaymentController } from './payment.controller';
import {
  PaymentDetail,
  PaymentDetailSchema,
} from './schemas/payment-detail.schema';
import { CardListener } from './listeners/card.listener';
import { PaymentListener } from './listeners/payment.listener';
import { ServiceListener } from './listeners/service.listener';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: PaymentMethodCatalog.name, schema: PaymentMethodCatalogSchema },
      { name: PaymentUser.name, schema: PaymentUserSchema },
      { name: PaymentDetail.name, schema: PaymentDetailSchema },
    ]),
  ],
  providers: [
    PaymentService,
    CardListener,
    PaymentListener,
    ServiceListener,
  ],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
