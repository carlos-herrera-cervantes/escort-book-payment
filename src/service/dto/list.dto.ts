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
}

export class ListServiceDTO {
  _id: string;
  escort: string;
  createdAt: Date;
  updatedAt: Date;
}
