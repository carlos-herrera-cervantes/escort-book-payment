import { CreateServiceDTO } from '../dto/create.dto';
import { Service } from '../schemas/service.schema';
import { Types } from 'mongoose';
import { PriceService } from '../../price/price.service';
import { ServiceService } from '../service.service';
import { TimeUnit } from '../enums/time-unit.enum';
import { BadRequestException } from '@nestjs/common';

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
      cardId,
      customerId,
      escortId,
      timeQuantity,
      timeMeasurementUnit,
      details,
    } = createServiceDTO;

    const self = this as Service;
    const price = await priceRepository.findOne({ where: { id: priceId } });

    if (timeQuantity < price.quantity) throw new BadRequestException();

    self.cardId = new Types.ObjectId(cardId);
    self.customerId = new Types.ObjectId(customerId);
    self.escortId = new Types.ObjectId(escortId);
    self.timeQuantity = timeQuantity;
    self.timeMeasurementUnit = timeMeasurementUnit;

    if (details) {
      var totalDetail = details.reduce((partialSum, value) => partialSum + value.cost, 0);
      
      createServiceDTO.details.push({
        serviceId: priceId,
        serviceName: 'Time',
        cost: price.cost,
      });
      
      const bulkResult = await serviceRepository.createBatchDetail(details);
      self.details = bulkResult.map(result => result._id);
    }

    self.price = timeMeasurementUnit == TimeUnit.Minutes ? price.cost + totalDetail :
      (timeQuantity * price.cost) + totalDetail;

    return self;
}
