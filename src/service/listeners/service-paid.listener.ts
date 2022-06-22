import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientKafka } from '@nestjs/microservices';
import { PaymentService } from '../../payment/payment.service';
import { ServiceEvents } from '../../config/event.config';
import { KafkaEvents } from '../../config/kafka.config';
import { Operation } from '../../config/operation.config';
import { PaidServiceEvent } from '../dto/create.dto';
import { Service } from '../schemas/service.schema';
import { PaymentDetail } from '../../payment/schemas/payment-detail.schema';
import { PaymentMethodCatalog } from '../../payment/schemas/payment-method-catalog.schema';

@Injectable()
export class ServicePaidListener {
  @Inject('EscortBookPayment')
  private readonly kafkaClient: ClientKafka;

  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent(ServiceEvents.Paid, { async: true })
  async handlePaidService(service: Service): Promise<void> {
    const { escortId, customerId, price, paymentDetails, businessCommission } =
      service;

    const paymentMethods = await this.paymentService.getPaymentDetails(
      { _id: { $in: paymentDetails } },
      { path: 'paymentMethodId' },
    );
    const paymentNames = paymentMethods.map((method: PaymentDetail) => {
      const catalog = method.paymentMethodId as PaymentMethodCatalog;
      return catalog.name;
    });

    const paidServiceEvent: PaidServiceEvent = {
      escortId: escortId.toString(),
      customerId: customerId.toString(),
      serviceCost: price + businessCommission,
      businessCommission,
      escortProfit: price,
      operation: Operation.ServicePaid,
      paymentMethods: paymentNames,
    };

    this.kafkaClient.emit(
      KafkaEvents.OperationStatistics,
      JSON.stringify(paidServiceEvent),
    );
  }
}
