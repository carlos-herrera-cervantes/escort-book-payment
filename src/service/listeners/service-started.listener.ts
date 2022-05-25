import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientKafka } from '@nestjs/microservices';
import { Service } from '../schemas/service.schema';
import '../extensions/date.extension';

@Injectable()
export class ServiceStartedListener {
  @Inject('EscortBookPayment')
  private readonly client: ClientKafka;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @OnEvent('service.started', { async: true })
  async handleServiceCreated(service: Service): Promise<void> {
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
    const topic = this.configService.get<string>('TOPIC');

    this.client.emit(topic, JSON.stringify(customerMessage));
    this.client.emit(topic, JSON.stringify(escortMessage));
  }
}
