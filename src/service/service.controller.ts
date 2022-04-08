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
  Patch,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { EscortProfileService } from '../escort-profile/escort-profile.service';
import { PaginateDTO } from '../common/query-param.dto';
import { ServiceDTO } from './dto/list.dto';
import { Service } from './schemas/service.schema';
import { ServiceService } from './service.service';
import { Types } from 'mongoose';
import { UpdateServiceDTO } from './dto/update.dto';
import { CreateServiceDTO } from './dto/create.dto';
import { PriceService } from 'src/price/price.service';
import { Pager } from '../common/pager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceStatus } from './enums/status.enum';
import { StatusGuard } from './guards/status.guard';
import './extensions/array.extension';
import './extensions/service.extension';

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

  @Get()
  async getByPagination(@Query() paginate: PaginateDTO, @Req() req: any): Promise<Pager> {
    const user = req?.body?.user;
    const filter = user?.type == 'Customer' ?
      { customerId: new Types.ObjectId(user.id) } :
      { escortId: new Types.ObjectId(user.id) };

    const [services, totalDocs] = await Promise.all([
      this.serviceService.getByPagination(paginate, filter),
      this.serviceService.count({ filter }),
    ]);
    
    return new Pager()
      .getPager(paginate, totalDocs, await services.setEscortProfile(this.escortProfileService));
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Req() req: any): Promise<ServiceDTO> {
    const customerId = req?.body?.user?.id;
    const service = await this.serviceService
      .getOneAndPopulate({ customerId, _id: id }, { path: 'cardId details' });

    if (!service) throw new NotFoundException();

    const escortProfile = await this.escortProfileService
      .findOne({ where: { escortId: service.escortId.toString() } });
    return new ServiceDTO().toServiceDetail(escortProfile, service);
  }

  @Post()
  async create(@Body() createServiceDTO: CreateServiceDTO, @Req() req: any): Promise<Service> {
    createServiceDTO.customerId = req?.body?.user?.id;
    const newService = await new Service().toService(createServiceDTO, this.priceService, this.serviceService);
    return this.serviceService.create(newService);
  }

  @Patch(':id')
  @UseGuards(StatusGuard)
  async updateOne(
    @Body() service: UpdateServiceDTO,
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<Service> {
    const user = req?.body?.user;
    const filter = user?.type == 'Customer' ?
      { customerId: user?.id, _id: id } :
      { escortId: user?.id, _id: id };

    const exists = await this.serviceService.getOne(filter);

    if (!exists) throw new NotFoundException();

    if (exists.status != ServiceStatus.Boarding) throw new ConflictException();

    const updatedService = await this.serviceService.updateOne(service, filter);
    this.eventEmitter.emit('service.paid', exists);

    return updatedService
  }
}
