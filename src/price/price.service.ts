import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Price } from './entities/price.entity';

@Injectable()
export class PriceService {
  @InjectRepository(Price)
  private readonly priceRepository: Repository<Price>;

  async findOne(filter: FindOneOptions<Price>): Promise<Price> {
    return this.priceRepository.findOne(filter);
  }
}
