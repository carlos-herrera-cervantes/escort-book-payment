import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { PaginateDTO } from '../common/dto/query-param.dto';
import { Service, ServiceDocument } from './schemas/service.schema';
import {
  ServiceDetail,
  ServiceDetailDocument,
} from './schemas/service-detail.schema';
import { CreateServiceDetailDTO } from './dto/create.dto';

@Injectable()
export class ServiceService {
  @InjectModel(Service.name)
  private readonly serviceModel: Model<ServiceDocument>;

  @InjectModel(ServiceDetail.name)
  private readonly serviceDetailModel: Model<ServiceDetailDocument>;

  async getByPagination(paginate: PaginateDTO, filter?: FilterQuery<Service>): Promise<Service[]> {
    const { offset, limit } = paginate;
    return this.serviceModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset * limit)
      .limit(limit);
  }

  async getOneAndPopulate(filter: FilterQuery<Service>, ...populateFilter: any): Promise<Service> {
    const query = this.serviceModel.findOne(filter);
    populateFilter.forEach((filter: object) => query.populate(filter));
    return query;
  }

  async create(service: Service): Promise<Service> {
    return this.serviceModel.create(service);
  }

  async createBatchDetail(details: CreateServiceDetailDTO[]): Promise<any> {
    return this.serviceDetailModel.insertMany(details);
  }

  async count(filter?: FilterQuery<Service>): Promise<number> {
    return this.serviceModel.countDocuments(filter);
  }
}
