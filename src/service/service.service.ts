import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { PaginateDTO } from '../common/dto/query-param.dto';
import { UpdateServiceDTO } from './dto/update.dto';
import { Service, ServiceDocument } from './schemas/service.schema';
import { ServiceDetail, ServiceDetailDocument } from './schemas/service-detail.schema';
import { CreateServiceDetailDTO } from './dto/create.dto';

@Injectable()
export class ServiceService {
  @InjectModel(Service.name)
  private readonly serviceModel: Model<ServiceDocument>;

  @InjectModel(ServiceDetail.name)
  private readonly serviceDetailModel: Model<ServiceDetailDocument>;

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

  async create(service: Service): Promise<Service> {
    return this.serviceModel.create(service);
  }

  async createBatchDetail(details: CreateServiceDetailDTO[]): Promise<any> {
    return this.serviceDetailModel.insertMany(details);
  }

  async updateOne(
    service: UpdateServiceDTO,
    filter: FilterQuery<Service>,
  ): Promise<Service> {
    const doc = await this.serviceModel.findOneAndUpdate(
      filter,
      { $set: service },
      { new: true },
    );
    
    return doc;
  }

  async count(filter?: FilterQuery<Service>): Promise<number> {
    return this.serviceModel.countDocuments(filter);
  }
}
