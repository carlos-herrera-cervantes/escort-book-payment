import { Card } from '../../card/schemas/card.schema';
import { EscortProfile } from '../../escort-profile/entities/escort-profile.entity';
import { Service } from '../schemas/service.schema';

export class ServiceDTO {
  _id: string;
  card: string;
  escort: string;
  status: string;
  price: number;
  timeQuantity: number;
  timeMeasurementUnit: string;
  createdAt: Date;
  updatedAt: Date;

  toServiceDetail(escortProfile: EscortProfile, service: Service): ServiceDTO {
    const card = service.cardId as Card;

    this._id = service._id;
    this.card = card.numbers;
    this.escort = `${escortProfile.firstName} ${escortProfile.lastName}`;
    this.status = service.status;
    this.price = service.price;
    this.timeQuantity = service.timeQuantity;
    this.timeMeasurementUnit = service.timeMeasurementUnit;
    this.createdAt = service.createdAt;
    this.updatedAt = service.updatedAt;

    return this
  }
}

export class ListServiceDTO {
  _id: string;
  escort: string;
  createdAt: Date;
  updatedAt: Date;
}
