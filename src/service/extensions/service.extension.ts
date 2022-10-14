import { PaymentDetail } from '../../payment/schemas/payment-detail.schema';
import {
  EscortProfile,
} from '../../escort-profile/entities/escort-profile.entity';
import { ServiceDTO } from '../dto/list.dto';
import { ServiceDetail } from '../schemas/service-detail.schema';
import { Service } from '../schemas/service.schema';
import { PaymentMethodCatalog } from '../../payment/schemas/payment-method-catalog.schema';

declare global {
  interface Object {
    setDetail(escortProfile: EscortProfile): ServiceDTO;
  }
}

Object.prototype.setDetail = function (escortProfile: EscortProfile): ServiceDTO {
  const self = this as Service;
  const details = self.details as ServiceDetail[];
  const paymentDetails = self.paymentDetails as PaymentDetail[];

  const newServiceDetail = new ServiceDTO();

  newServiceDetail._id = self._id;
  newServiceDetail.escort = `${escortProfile.firstName} ${escortProfile.lastName}`;
  newServiceDetail.escortId = escortProfile.escortId;
  newServiceDetail.status = self.status;
  newServiceDetail.price = self.price;
  newServiceDetail.timeQuantity = self.timeQuantity;
  newServiceDetail.timeMeasurementUnit = self.timeMeasurementUnit;
  newServiceDetail.partialPayment = self.partialPayment;
  newServiceDetail.createdAt = self.createdAt;
  newServiceDetail.updatedAt = self.updatedAt;
  newServiceDetail.details = details.map((detail) => ({
    name: detail.serviceName,
    cost: detail.cost,
  }));
  newServiceDetail.paymentDetails = paymentDetails.map((detail) => {
    const paymentMethod = detail.paymentMethodId as PaymentMethodCatalog;
    return { name: paymentMethod.name, quantity: detail.quantity };
  });

  return newServiceDetail;
}
