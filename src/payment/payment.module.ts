import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicePaidListener } from './listeners/service-paid.listener';
import { SoftDeletePaymentMethodListener } from './listeners/soft-delete-payment-method.listener';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import {
  PaymentMethodCatalog,
  PaymentMethodCatalogSchema,
} from './schemas/payment-method-catalog.schema';
import { PaymentUser, PaymentUserSchema } from './schemas/payment-user.schema';
import { PaymentController } from './payment.controller';
import { CardCreatedListener } from './listeners/card-created.listener';
import { EmptyCardsListener } from './listeners/empty-cards.listener';
import {
  PaymentDetail,
  PaymentDetailSchema,
} from './schemas/payment-detail.schema';
import { ServiceCreatedListener } from './listeners/service-created.listener';

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
    ServicePaidListener,
    SoftDeletePaymentMethodListener,
    CardCreatedListener,
    EmptyCardsListener,
    ServiceCreatedListener,
  ],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
