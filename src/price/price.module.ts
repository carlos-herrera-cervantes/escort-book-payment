import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceDetail } from './entities/price-detail.entity';
import { Price } from './entities/price.entity';
import { PriceService } from './price.service';

@Module({
  imports: [TypeOrmModule.forFeature([Price, PriceDetail])],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
