import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientKafka } from '@nestjs/microservices';
import '../extensions/string.extension';

@Injectable()
export class ServiceCreatedListener {

  @Inject('EscortBookPayment')
  private readonly client: ClientKafka;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @OnEvent('service.created', { async: true })
  async handleServiceCreated(serviceId: string): Promise<void> {
    const now = new Date();
    const escortThreshold = new Date(now);
    const customerThreshold = new Date(now)
    
    escortThreshold.setMinutes(now.getMinutes() + 60)
    customerThreshold.setMinutes(now.getMinutes() + 55);

    const customerMessage = {
      serviceId,
      userType: 'Customer',
      scheduleExpression: customerThreshold.toCronExpression(),
    };
    const escortMessage = {
      serviceId,
      userType: 'Escort',
      scheduleExpression: escortThreshold.toCronExpression(),
    };
    const topic = this.configService.get<string>('TOPIC');

    this.client.emit(topic, JSON.stringify(customerMessage));
    this.client.emit(topic, JSON.stringify(escortMessage));
  }

}