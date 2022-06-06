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
