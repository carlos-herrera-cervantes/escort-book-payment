import { PaymentDetail } from '../../payment/schemas/payment-detail.schema';
import { EscortProfile } from '../../escort-profile/entities/escort-profile.entity';
import { ServiceDetail } from '../schemas/service-detail.schema';
import { Service } from '../schemas/service.schema';
import { PaymentMethodCatalog } from '../../payment/schemas/payment-method-catalog.schema';

export class ServiceDTO {
  _id: string;
  escort: string;
  escortId: string;
  status: string;
  price: number;
  timeQuantity: number;
  timeMeasurementUnit: string;
  details: object[];
  paymentDetails: object[];
  createdAt: Date;
  updatedAt: Date;

  toServiceDetail(escortProfile: EscortProfile, service: Service): ServiceDTO {
    const details = service.details as ServiceDetail[];
    const paymentDetails = service.paymentDetails as PaymentDetail[];

    this._id = service._id;
    this.escort = `${escortProfile.firstName} ${escortProfile.lastName}`;
    this.escortId = escortProfile.escortId;
    this.status = service.status;
    this.price = service.price;
    this.timeQuantity = service.timeQuantity;
    this.timeMeasurementUnit = service.timeMeasurementUnit;
    this.createdAt = service.createdAt;
    this.updatedAt = service.updatedAt;
    this.details = details.map((detail) => ({
      name: detail.serviceName,
      cost: detail.cost,
    }));
    this.paymentDetails = paymentDetails.map((detail) => {
      const paymentMethod = detail.paymentMethodId as PaymentMethodCatalog;
      return { name: paymentMethod.name, quantity: detail.quantity };
    });

    return this;
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

export class ListTotalDTO {
  total: number;
}
