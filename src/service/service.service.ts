import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { PaginateDTO } from '../common/query-param.dto';
import { CreateServiceDTO } from './dto/create.dto';
import { Service, ServiceDocument } from './schemas/service.schema';

@Injectable()
export class ServiceService {
  @InjectModel(Service.name)
  private readonly serviceModel: Model<ServiceDocument>;

  async getAll(filter?: FilterQuery<Service>): Promise<Service[]> {
    return this.serviceModel.find(filter).lean();
  }

  async getByPagination(
    paginate: PaginateDTO,
    filter?: FilterQuery<Service>,
  ): Promise<Service[]> {
    const { offset, limit } = paginate;
    return this.serviceModel
      .find(filter)
      .skip(offset * limit)
      .limit(limit);
  }

  async getByPaginationAndPopulate(
    paginate: PaginateDTO,
    populateFilter: any,
    filter?: FilterQuery<Service>,
  ): Promise<Service[]> {
    const { offset, limit } = paginate;
    return this.serviceModel
      .find(filter)
      .populate(populateFilter)
      .skip(offset * limit)
      .limit(limit);
  }

  async getOne(filter: FilterQuery<Service>): Promise<Service> {
    return this.serviceModel.findOne(filter).lean();
  }

  async getOneAndPopulate(
    filter: FilterQuery<Service>,
    populateFilter: any
  ): Promise<Service> {
    return this.serviceModel.findOne(filter).populate(populateFilter).lean();
  }

  async create(service: CreateServiceDTO): Promise<Service> {
    return this.serviceModel.create(service);
  }
}
