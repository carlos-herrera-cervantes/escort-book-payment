import { CreateServiceDTO } from '../dto/create.dto';
import { Service } from '../schemas/service.schema';
import { Types } from 'mongoose';
import { PriceService } from '../../price/price.service';

export {};

declare module '../schemas/service.schema' {
  interface Service {
    toService(createServiceDTO: CreateServiceDTO, priceRepository: PriceService): Promise<Service>;
  }
}

Service.prototype.toService = async function (
  createServiceDTO: CreateServiceDTO,
  priceRepository: PriceService,
): Promise<Service> {
    const self = this as Service;
    const price = await priceRepository.findOne({ where: { id: createServiceDTO.priceId } });

    self.cardId = new Types.ObjectId(createServiceDTO.cardId);
    self.customerId = new Types.ObjectId(createServiceDTO.customerId);
    self.escortId = new Types.ObjectId(createServiceDTO.escortId);
    self.timeQuantity = createServiceDTO.timeQuantity;
    self.timeMeasurementUnit = createServiceDTO.timeMeasurementUnit;
    self.price = createServiceDTO.timeQuantity * price.cost;

    return self;
}
