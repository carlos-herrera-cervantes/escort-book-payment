import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { PriceDetail } from './entities/price-detail.entity';

@Injectable()
export class PriceService {
  @InjectRepository(Price)
  private readonly priceRepository: Repository<Price>;

  @InjectRepository(PriceDetail)
  private readonly priceDetailRepository: Repository<PriceDetail>;

  async findOne(filter: FindOneOptions<Price>): Promise<Price> {
    return this.priceRepository.findOne(filter);
  }

  async countPriceDetail(
    filter?: FindOneOptions<PriceDetail>,
  ): Promise<number> {
    return this.priceDetailRepository.count(filter);
  }
}
