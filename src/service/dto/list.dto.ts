export class ServiceDTO {
  _id: string;
  escort: string;
  escortId: string;
  status: string;
  price: number;
  timeQuantity: number;
  timeMeasurementUnit: string;
  partialPayment: boolean;
  details: object[];
  paymentDetails: object[];
  createdAt: Date;
  updatedAt: Date;
}

export class ListServiceDTO {
  _id: string;
  escort: string;
  customerId: string;
  escortId: string;
  cost: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ListTotal {
  total: number;
}
