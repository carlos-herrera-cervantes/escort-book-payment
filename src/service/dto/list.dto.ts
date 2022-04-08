import { Card } from '../../card/schemas/card.schema';
import { EscortProfile } from '../../escort-profile/entities/escort-profile.entity';
import { ServiceDetail } from '../schemas/service-detail.schema';
import { Service } from '../schemas/service.schema';

export class ServiceDTO {
  _id: string;
  card: string;
  escort: string;
  escortId: string;
  status: string;
  price: number;
  timeQuantity: number;
  timeMeasurementUnit: string;
  details: object[];
  createdAt: Date;
  updatedAt: Date;

  toServiceDetail(escortProfile: EscortProfile, service: Service): ServiceDTO {
    const card = service.cardId as Card;
    const details = service.details as ServiceDetail[];

    this._id = service._id;
    this.card = card.numbers;
    this.escort = `${escortProfile.firstName} ${escortProfile.lastName}`;
    this.escortId = escortProfile.escortId;
    this.status = service.status;
    this.price = service.price;
    this.timeQuantity = service.timeQuantity;
    this.timeMeasurementUnit = service.timeMeasurementUnit;
    this.createdAt = service.createdAt;
    this.updatedAt = service.updatedAt;
    this.details = details.map(detail => ({ name: detail.serviceName, cost: detail.cost }));

    return this
  }
}

export class ListServiceDTO {
  _id: string;
  escort: string;
  cost: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
