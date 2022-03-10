import { Body, Controller, Get, Inject, Param, Query, Req, Post, NotFoundException } from '@nestjs/common';
import { EscortProfileService } from '../escort-profile/escort-profile.service';
import { PaginateDTO } from '../common/query-param.dto';
import { CreateServiceDTO } from './dto/create.dto';
import { ListServiceDTO, ServiceDTO } from './dto/list.dto';
import { Service } from './schemas/service.schema';
import { ServiceService } from './service.service';
import { Card } from '../card/schemas/card.schema';
import { Types } from 'mongoose';

@Controller('/api/v1/payments/services')
export class ServiceController {
  @Inject(ServiceService)
  private readonly serviceService: ServiceService;

  @Inject(EscortProfileService)
  private readonly escortProfileService: EscortProfileService

  @Get()
  async getByPagination(@Query() paginate: PaginateDTO, @Req() req: any): Promise<ListServiceDTO[]> {
    const customerId: string = req?.body?.user?.id;
    const services = await this.serviceService
      .getByPagination(paginate, { customerId: new Types.ObjectId(customerId) });
    const listServiceDTO = [];

    for (const service of services) {
      const escortProfile = await this.escortProfileService
        .findOne({ where: { escortId: service.escortId.toString() } });
      const innerListServiceDTO = new ListServiceDTO();

      innerListServiceDTO._id = service._id;
      innerListServiceDTO.escort = `${escortProfile.firstName} ${escortProfile.lastName}`;
      innerListServiceDTO.createdAt = service.createdAt;
      innerListServiceDTO.updatedAt = service.updatedAt;

      listServiceDTO.push(innerListServiceDTO);
    }

    return listServiceDTO;
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Req() req: any): Promise<ServiceDTO> {
    const customerId: string = req?.body?.user?.id;
    const service: Service = await this.serviceService
      .getOneAndPopulate({ customerId, _id: id }, { path: 'cardId', select: 'numbers' });

    if (!service) throw new NotFoundException();

    const escortProfile = await this.escortProfileService
      .findOne({ where: { escortId: service.escortId.toString() } });

    const card = service.cardId as Card;

    const serviceDetail = new ServiceDTO();
    serviceDetail._id = service._id;
    serviceDetail.card = card.numbers;
    serviceDetail.escort = `${escortProfile.firstName} ${escortProfile.lastName}`;
    serviceDetail.status = service.status;
    serviceDetail.price = service.price;
    serviceDetail.timeQuantity = service.timeQuantity;
    serviceDetail.timeMeasurementUnit = service.timeMeasurementUnit;
    serviceDetail.createdAt = service.createdAt;
    serviceDetail.updatedAt = service.updatedAt;

    return serviceDetail;
  }

  @Post()
  async create(@Body() service: CreateServiceDTO, @Req() req: any): Promise<Service> {
    const customerId: string = req?.body?.user?.id;
    service.customerId = customerId;

    return this.serviceService.create(service);
  }
}