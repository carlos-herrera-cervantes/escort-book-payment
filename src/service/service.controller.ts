import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Req,
  Post,
  NotFoundException,
  UseGuards,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EscortProfileService } from '../escort-profile/escort-profile.service';
import { PaginateDTO } from '../common/dto/query-param.dto';
import { ListTotalDTO, ServiceDTO } from './dto/list.dto';
import { Service } from './schemas/service.schema';
import { ServiceService } from './service.service';
import { Types } from 'mongoose';
import { UpdateServiceDTO } from './dto/update.dto';
import { CalculateTotalServiceDTO, CreateServiceDTO } from './dto/create.dto';
import { PriceService } from '../price/price.service';
import { Pager } from '../common/helpers/pager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AssetsGuard } from './guards/assets.guard';
import { CardGuard } from './guards/card.guard';
import { TimeUnit } from './enums/time-unit.enum';
import { In } from 'typeorm';
import { CardService } from '../card/card.service';
import { MessageResponseDTO } from '../common/dto/message-response.dto';
import { ServiceStatus } from './enums/status.enum';
import { ServiceEvents } from '../config/event.config';
import './extensions/array.extension';
import './extensions/create-dto.extension';
import './extensions/service.extension';
import '../common/extensions/number.extensions';

@Controller('/api/v1/payments/services')
export class ServiceController {
  @Inject(ServiceService)
  private readonly serviceService: ServiceService;

  @Inject(EscortProfileService)
  private readonly escortProfileService: EscortProfileService;

  @Inject(PriceService)
  private readonly priceService: PriceService;

  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  @Inject(CardService)
  private readonly cardService: CardService;

  @Get()
  async getByPagination(
    @Query() paginate: PaginateDTO,
    @Req() req: any,
  ): Promise<Pager> {
    const user = req?.body?.user;
    const filter =
      user?.type == 'Customer'
        ? { customerId: new Types.ObjectId(user.id) }
        : { escortId: new Types.ObjectId(user.id) };

    const [services, totalDocs] = await Promise.all([
      this.serviceService.getByPagination(paginate, filter),
      this.serviceService.count(filter),
    ]);
    const data = await services.setEscortProfile(this.escortProfileService);

    return new Pager().getPager(paginate, totalDocs, data);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Req() req: any): Promise<ServiceDTO> {
    const customerId = req?.body?.user?.id;
    const service = await this.serviceService.getOneAndPopulate(
      { customerId, _id: id },
      { path: 'paymentDetails', populate: { path: 'paymentMethodId' } },
      { path: 'details' },
    );

    if (!service) throw new NotFoundException();

    const escortProfile = await this.escortProfileService.findOne({
      where: { escortId: service.escortId.toString() },
    });

    return service.setDetail(escortProfile);
  }

  @Post('total')
  async calculateTotal(
    @Body() calculateTotal: CalculateTotalServiceDTO,
  ): Promise<ListTotalDTO> {
    const { priceId, timeQuantity, details, timeMeasurementUnit } =
      calculateTotal;
    const price = await this.priceService.findOne({ where: { id: priceId } });

    if (!price) throw new NotFoundException();
    if (timeQuantity < price.quantity) throw new BadRequestException();

    const serviceIds = details.map((element) => element.serviceId);
    const priceCounter = await this.priceService.countPriceDetail({
      where: { id: In(serviceIds) },
    });

    if (priceCounter != serviceIds.length) throw new NotFoundException();

    const totalDetail = details.reduce(
      (partialSum, value) => partialSum + value.cost,
      0,
    );
    const total =
      timeMeasurementUnit == TimeUnit.Minutes
        ? price.cost + totalDetail
        : timeQuantity * price.cost + totalDetail;

    const businessCommission = total.calculatePercentage(10);

    return { total: total + businessCommission };
  }

  @Post()
  @UseGuards(AssetsGuard)
  @UseGuards(CardGuard)
  async create(
    @Body() createServiceDTO: CreateServiceDTO,
    @Req() req: any,
  ): Promise<Service> {
    createServiceDTO.customerId = req?.body?.user?.id;

    const newService = await createServiceDTO.toService(
      this.priceService,
      this.serviceService,
    );
    const created = await this.serviceService.create(newService);

    this.eventEmitter.emit(
      ServiceEvents.Created,
      created,
      createServiceDTO.paymentDetails,
    );

    return created;
  }

  @Post(':id/start')
  async startService(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<MessageResponseDTO> {
    const escortId = req?.body?.user?.id;
    const filter = { escortId, _id: id };
    const exists = await this.serviceService.getOneAndPopulate(filter, {
      path: 'paymentDetails',
      populate: { path: 'paymentMethodId' },
    });

    if (!exists) throw new NotFoundException('Service not found');

    if (escortId != exists.escortId.toString()) {
      throw new ForbiddenException('Escort does not correspond with the service');
    }

    if (exists.status != ServiceStatus.Boarding) {
      throw new BadRequestException();
    }

    this.eventEmitter.emit(ServiceEvents.Started, exists);

    return { message: 'Service started' };
  }

  @Post(':id/pay')
  async payService(
    @Body() service: UpdateServiceDTO,
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<MessageResponseDTO> {
    const filter = { customerId: req?.body?.user?.id, _id: id };
    const exists = await this.serviceService.getOneAndPopulate(filter, {
      path: 'paymentDetails',
      populate: { path: 'paymentMethodId' },
    });

    if (!exists) throw new NotFoundException('Service not found');

    if (exists.status != ServiceStatus.Started) {
      throw new BadRequestException('Service is not started');
    }

    if (service.cardId) {
      const cardPayment = exists.paymentDetails.some(
        (paymentMethod: any) => paymentMethod.paymentMethodId.name == 'Card',
      );
      const cardCounter = await this.cardService.count({ _id: service.cardId });

      if (!cardCounter || !cardPayment) {
        throw new NotFoundException('Card not found');
      }
    }

    this.eventEmitter.emit(ServiceEvents.Paid, exists, service.cardId);

    return { message: 'Pending' };
  }
}
