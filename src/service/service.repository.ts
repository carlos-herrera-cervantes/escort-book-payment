import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Paginate } from '../common/dto/query-param.dto';
import { Service, ServiceDocument } from './schemas/service.schema';
import {
  ServiceDetail,
  ServiceDetailDocument,
} from './schemas/service-detail.schema';
import { CreateServiceDetail } from './dto/create.dto';

@Injectable()
export class ServiceRepository {
  @InjectModel(Service.name)
  private readonly serviceModel: Model<ServiceDocument>;

  @InjectModel(ServiceDetail.name)
  private readonly serviceDetailModel: Model<ServiceDetailDocument>;

  async getByPagination(paginate: Paginate, filter?: FilterQuery<Service>): Promise<Service[]> {
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

  async createBatchDetail(details: CreateServiceDetail[]): Promise<any> {
    return this.serviceDetailModel.insertMany(details);
  }

  async count(filter?: FilterQuery<Service>): Promise<number> {
    return this.serviceModel.countDocuments(filter);
  }

  async countDetails(filter?: FilterQuery<ServiceDetail>): Promise<number> {
    return this.serviceDetailModel.countDocuments(filter);
  }

  async deleteMany(filter?: FilterQuery<Service>): Promise<void> {
    await this.serviceModel.deleteMany(filter);
  }

  async deleteDetails(filter?: FilterQuery<ServiceDetail>): Promise<void> {
    await this.serviceDetailModel.deleteMany(filter);
  }
}
