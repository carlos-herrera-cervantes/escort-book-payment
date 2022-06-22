import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientKafka } from '@nestjs/microservices';
import { ServiceDocument } from '../schemas/service.schema';
import { ServiceStatus } from '../enums/status.enum';
import { ServiceEvents } from '../../config/event.config';
import { KafkaEvents } from '../../config/kafka.config';
import '../extensions/date.extension';

@Injectable()
export class ServiceStartedListener {
  @Inject('EscortBookPayment')
  private readonly kafkaClient: ClientKafka;

  @OnEvent(ServiceEvents.Started, { async: true })
  async handleServiceCreated(service: ServiceDocument): Promise<void> {
    const { _id, timeQuantity, timeMeasurementUnit } = service;

    const now = new Date();
    const escortThreshold = new Date(now).addServiceTime(
      timeQuantity,
      timeMeasurementUnit,
      now,
    );
    const customerThreshold = new Date(now).addServiceTime(
      timeQuantity,
      timeMeasurementUnit,
      now,
    );

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
}
