import { CreateServiceDTO } from '../dto/create.dto';
import { Service } from '../schemas/service.schema';
import { Types } from 'mongoose';
import { PriceService } from '../../price/price.service';
import { ServiceService } from '../service.service';
import { TimeUnit } from '../enums/time-unit.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export {};

declare module '../schemas/service.schema' {
  interface Service {
    toService(
      createServiceDTO: CreateServiceDTO,
      priceRepository: PriceService,
      serviceRepository: ServiceService,
    ): Promise<Service>;
  }
}

Service.prototype.toService = async function (
  createServiceDTO: CreateServiceDTO,
  priceRepository: PriceService,
  serviceRepository: ServiceService,
): Promise<Service> {
  const {
    priceId,
    customerId,
    escortId,
    timeQuantity,
    timeMeasurementUnit,
    details,
    paymentDetails,
  } = createServiceDTO;

  const self = this as Service;
  const price = await priceRepository.findOne({ where: { id: priceId } });

  if (!price) throw new NotFoundException();
  if (timeQuantity < price.quantity) throw new BadRequestException();

  self.customerId = new Types.ObjectId(customerId);
  self.escortId = new Types.ObjectId(escortId);
  self.timeQuantity = timeQuantity;
  self.timeMeasurementUnit = timeMeasurementUnit;

  let totalDetail = 0;

  if (details) {
    totalDetail = details.reduce(
      (partialSum, value) => partialSum + value.cost,
      0,
    );

    createServiceDTO.details.push({
      serviceId: priceId,
      serviceName: 'Time',
      cost: price.cost,
    });

    const bulkResult = await serviceRepository.createBatchDetail(details);
    self.details = bulkResult.map((result) => result._id);
  }

  self.price =
    timeMeasurementUnit == TimeUnit.Minutes
      ? price.cost + totalDetail
      : timeQuantity * price.cost + totalDetail;

  const totalReceived = paymentDetails.reduce(
    (partialSum, value) => partialSum + value.quantity,
    0,
  );

  if (totalReceived < self.price) throw new BadRequestException();

  return self;
};
