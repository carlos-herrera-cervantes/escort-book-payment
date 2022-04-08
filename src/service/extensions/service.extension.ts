import { CreateServiceDTO } from '../dto/create.dto';
import { Service } from '../schemas/service.schema';
import { Types } from 'mongoose';
import { PriceService } from '../../price/price.service';
import { ServiceService } from '../service.service';

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
    const self = this as Service;
    const price = await priceRepository.findOne({ where: { id: createServiceDTO.priceId } });

    self.cardId = new Types.ObjectId(createServiceDTO.cardId);
    self.customerId = new Types.ObjectId(createServiceDTO.customerId);
    self.escortId = new Types.ObjectId(createServiceDTO.escortId);
    self.timeQuantity = createServiceDTO.timeQuantity;
    self.timeMeasurementUnit = createServiceDTO.timeMeasurementUnit;

    if (createServiceDTO.details) {
      var totalDetail = createServiceDTO.details.reduce((partialSum, value) => partialSum + value.cost, 0);
      
      createServiceDTO.details.push({
        serviceId: createServiceDTO.priceId,
        serviceName: 'Time',
        cost: price.cost,
      });
      
      const bulkResult = await serviceRepository.createBatchDetail(createServiceDTO.details);
      self.details = bulkResult.map(result => result._id);
    }

    self.price = (createServiceDTO.timeQuantity * price.cost) + totalDetail;

    return self;
}
