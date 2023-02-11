import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Post,
  NotFoundException,
  UseGuards,
  BadRequestException,
  ForbiddenException,
  Headers,
} from '@nestjs/common';
import { EscortProfileService } from '../escort-profile/escort-profile.service';
import { Paginate } from '../common/dto/query-param.dto';
import { ListServiceDTO, ListTotal, ServiceDTO } from './dto/list.dto';
import { Service } from './schemas/service.schema';
import { ServiceRepository } from './service.repository';
import { Types } from 'mongoose';
import { UpdateService } from './dto/update.dto';
import { CalculateTotalService, CreateService } from './dto/create.dto';
import { PriceService } from '../price/price.service';
import { Pager } from '../common/helpers/pager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AssetsGuard } from './guards/assets.guard';
import { CardGuard } from './guards/card.guard';
import { TimeUnit } from './enums/time-unit.enum';
import { In } from 'typeorm';
import { CardService } from '../card/card.service';
import { MessageResponse } from '../common/dto/message-response.dto';
import { ServiceStatus } from './enums/status.enum';
import { ServiceEvents } from '../config/event.config';
import './extensions/array.extension';
import './extensions/create-dto.extension';
import './extensions/service.extension';
import '../common/extensions/number.extensions';

@Controller('/api/v1/payments/services')
export class ServiceController {
  @Inject(ServiceRepository)
  private readonly serviceService: ServiceRepository;

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
    @Query() paginate: Paginate,
    @Headers('user-id') userId: string,
    @Headers('user-type') userType: string,
  ): Promise<Pager<ListServiceDTO>> {
    const filter = userType == 'Customer'
      ? { customerId: new Types.ObjectId(userId) }
      : { escortId: new Types.ObjectId(userId) };

    const [services, totalDocs] = await Promise.all([
      this.serviceService.getByPagination(paginate, filter),
      this.serviceService.count(filter),
    ]);
    const data = await services.setEscortProfile(this.escortProfileService);

    return new Pager<ListServiceDTO>(paginate, totalDocs, data).getPager();
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Headers('user-id') userId: string): Promise<ServiceDTO> {
    const service = await this.serviceService.getOneAndPopulate(
      { customerId: userId, _id: id },
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
  async calculateTotal(@Body() calculateTotalService: CalculateTotalService): Promise<ListTotal> {
    const { priceId, timeQuantity, details, timeMeasurementUnit } = calculateTotalService;
    const price = await this.priceService.findOne({ where: { id: priceId } });

    if (!price) throw new NotFoundException();
    if (timeQuantity < price.quantity) throw new BadRequestException();

    const serviceIds = details.map((element) => element.serviceId);
    const priceCounter = await this.priceService.countPriceDetail({
      where: { id: In(serviceIds) },
    });

    if (priceCounter != serviceIds.length) throw new NotFoundException();

    const totalDetail = details.reduce((partialSum, value) => partialSum + value.cost, 0);
    const total = timeMeasurementUnit == TimeUnit.Minutes
      ? price.cost + totalDetail
      : timeQuantity * price.cost + totalDetail;

    const businessCommission = total.calculatePercentage(10);

    return { total: total + businessCommission };
  }

  @Post()
  @UseGuards(AssetsGuard)
  @UseGuards(CardGuard)
  async create(@Body() createService: CreateService, @Headers('user-id') userId: string): Promise<Service> {
    createService.customerId = userId;

    const newService = await createService.toService(this.priceService, this.serviceService);
    const created = await this.serviceService.create(newService);

    this.eventEmitter.emit(ServiceEvents.Created, created, createService.paymentDetails);

    return created;
  }

  @Post(':id/start')
  async startService(@Headers('user-id') userId: string, @Param('id') id: string): Promise<MessageResponse> {
    const filter = { escortId: userId, _id: id };
    const exists = await this.serviceService.getOneAndPopulate(filter, {
      path: 'paymentDetails',
      populate: { path: 'paymentMethodId' },
    });

    if (!exists) throw new NotFoundException('Service not found');

    if (userId != exists.escortId.toString()) {
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
    @Body() service: UpdateService,
    @Headers('user-id') userId: string,
    @Param('id') id: string,
  ): Promise<MessageResponse> {
    const filter = { customerId: userId, _id: id };
    const exists = await this.serviceService.getOneAndPopulate(filter, {
      path: 'paymentDetails',
      populate: { path: 'paymentMethodId' },
    });

    if (!exists) throw new NotFoundException('Service not found');

    if (exists.status != ServiceStatus.Started) {
      throw new BadRequestException('Service is not started');
    }

    if (service.cardId) {
      const cardPayment = exists.paymentDetails.some((paymentMethod: any) =>
        paymentMethod.paymentMethodId.name == 'Card');
      const cardCounter = await this.cardService.count({ _id: service.cardId });

      if (!cardCounter || !cardPayment) {
        throw new NotFoundException('Card not found');
      }
    }

    this.eventEmitter.emit(ServiceEvents.Paid, exists, service.cardId);

    return { message: 'Pending' };
  }
}
