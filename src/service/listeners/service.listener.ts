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
import { ServiceDocument } from '../schemas/service.schema';
import { ServiceStatus } from '../enums/status.enum';
import '../extensions/date.extension';

@Injectable()
export class ServiceListener {
  @Inject('EscortBookPayment')
  private readonly kafkaClient: ClientKafka;

  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @OnEvent(ServiceEvents.Paid, { async: true })
  async handlePaidService(service: Service): Promise<void> {
    const {
      escortId, customerId, price, paymentDetails, businessCommission, _id
    } = service;

    const paymentMethods = await this.paymentService.getPaymentDetails({
      _id: { $in: paymentDetails }
    }, {
      path: 'paymentMethodId'
    });
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
      serviceId: _id,
    };

    this.kafkaClient.emit(KafkaEvents.OperationStatistics, JSON.stringify(paidServiceEvent));
  }

  @OnEvent(ServiceEvents.Started, { async: true })
  async handlerStartedService(service: ServiceDocument): Promise<void> {
    const { _id, timeQuantity, timeMeasurementUnit } = service;
    const now = new Date();
    const escortThreshold = new Date(now).addServiceTime(timeQuantity, timeMeasurementUnit, now);
    const customerThreshold = new Date(now).addServiceTime(timeQuantity, timeMeasurementUnit, now);

    escortThreshold.setHours(escortThreshold.getHours() + 1);
    customerThreshold.setMinutes(customerThreshold.getMinutes() + 50);

    const customerMessage = {
      serviceId: _id,
      userType: 'Customer',
      scheduleExpression: customerThreshold.toCronExpression(),
    };
    const escortMessage = {
      serviceId: _id,
      userType: 'Escort',
      scheduleExpression: escortThreshold.toCronExpression(),
    };

    this.kafkaClient.emit(KafkaEvents.ServiceStarted, JSON.stringify(customerMessage));
    this.kafkaClient.emit(KafkaEvents.ServiceStarted, JSON.stringify(escortMessage));

    service.status = ServiceStatus.Started;
    await service.save();
  }

  @OnEvent(ServiceEvents.Created, { async: true })
  async handleCreatedService(service: Service): Promise<void> {
    const { _id } = service;
    const message = { serviceId: _id };

    this.kafkaClient.emit(KafkaEvents.ServiceCreated, JSON.stringify(message));
  }
}
