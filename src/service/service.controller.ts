import { Body, Controller, Get, Inject, Param, Query, Req, Post, NotFoundException } from '@nestjs/common';
import { PaginateDTO } from '../common/query-param.dto';
import { CreateServiceDTO } from './dto/create.dto';
import { Service } from './schemas/service.schema';
import { ServiceService } from './service.service';

@Controller('/api/v1/payments/services')
export class ServiceController {
  @Inject(ServiceService)
  private readonly serviceService: ServiceService;

  @Get()
  async getByPagination(@Query() paginate: PaginateDTO, @Req() req: any): Promise<Service[]> {
    const customerId: string = req?.user?.customerId ?? '6213295f07ef497a5a9479cd';
    return this.serviceService.getByPagination(paginate, { customerId });
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Req() req: any): Promise<Service> {
    const customerId: string = req?.user?.customerId ?? '6213295f07ef497a5a9479cd';
    const service: Service = await this.serviceService.getOne({ customerId, _id: id });

    if (!service) throw new NotFoundException();

    return service;
  }

  @Post()
  async create(@Body() service: CreateServiceDTO, @Req() req: any): Promise<Service> {
    const customerId: string = req?.user?.customerId ?? '6213295f07ef497a5a9479cd';
    service.customerId = customerId;

    return this.serviceService.create(service);
  }
}