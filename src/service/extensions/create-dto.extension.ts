import { CreateServiceDTO } from '../dto/create.dto';
import { Service } from '../schemas/service.schema';
import { Types } from 'mongoose';
import { PriceService } from '../../price/price.service';
import { ServiceService } from '../service.service';
import { TimeUnit } from '../enums/time-unit.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import '../../common/extensions/number.extensions';

declare module '../dto/create.dto' {
  interface CreateServiceDTO {
    toService(priceRepository: PriceService, serviceRepository: ServiceService): Promise<Service>;
  }
}

CreateServiceDTO.prototype.toService = async function(priceRepository: PriceService, serviceRepository: ServiceService): Promise<Service> {
  const self = this as CreateServiceDTO;
  const {
    priceId,
    customerId,
    escortId,
    timeQuantity,
    timeMeasurementUnit,
    details,
    paymentDetails,
  } = self;
  const price = await priceRepository.findOne({ where: { id: priceId } });

  if (!price) throw new NotFoundException('Price does not exists');
  if (timeQuantity < price.quantity) {
    throw new BadRequestException('Invalid time quantity');
  }

  const newService = new Service();
  newService.customerId = new Types.ObjectId(customerId);
  newService.escortId = new Types.ObjectId(escortId);
  newService.timeQuantity = timeQuantity;
  newService.timeMeasurementUnit = timeMeasurementUnit;

  let totalDetail = 0;

  if (details) {
    totalDetail = details.reduce((partialSum, value) => partialSum + value.cost, 0);

    self.details.push({
      serviceId: priceId,
      serviceName: 'Time',
      cost: price.cost,
    });

    const bulkResult = await serviceRepository.createBatchDetail(details);
    newService.details = bulkResult.map((result: any) => result._id);
  }

  newService.price = timeMeasurementUnit == TimeUnit.Minutes
    ? price.cost + totalDetail
    : timeQuantity * price.cost + totalDetail;

  const businessCommission = newService.price.calculatePercentage(10);
  newService.businessCommission = businessCommission;

  const totalReceived = paymentDetails.reduce((partialSum, value) => partialSum + value.quantity, 0);

  if (totalReceived < (newService.price + businessCommission)) {
    throw new BadRequestException('Quantity is less than total');
  }

  return newService;
};
