import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Paginate } from 'src/common/dto/query-param.dto';
import { CreateDevolutionDTO } from './dto/create.dto';
import { Devolution, DevolutionDocument } from './schemas/devolution.schema';

@Injectable()
export class DevolutionService {
  @InjectModel(Devolution.name)
  private readonly devolutionModel: Model<DevolutionDocument>;

  async getAll(filter?: FilterQuery<Devolution>): Promise<Devolution[]> {
    return this.devolutionModel.find(filter).lean();
  }

  async getByPagination(paginate: Paginate, filter?: FilterQuery<Devolution>): Promise<Devolution[]> {
    const { offset, limit } = paginate;
    return this.devolutionModel
      .find(filter)
      .skip(offset * limit)
      .limit(limit);
  }

  async count(filter?: FilterQuery<Devolution>): Promise<number> {
    return this.devolutionModel.countDocuments(filter);
  }

  async getOne(filter?: FilterQuery<Devolution>): Promise<Devolution> {
    return this.devolutionModel.findOne(filter).lean();
  }

  async create(service: CreateDevolutionDTO): Promise<Devolution> {
    return this.devolutionModel.create(service);
  }

  async deleteMany(filter?: FilterQuery<Devolution>): Promise<void> {
    await this.devolutionModel.deleteMany(filter);
  }
}
