import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { EscortProfile } from '../escort-profile/entities/escort-profile.entity';
import { Price } from '../price/entities/price.entity';
import { PriceDetail } from '../price/entities/price-detail.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('ESCORT_PROFILE_HOST'),
      port: this.configService.get<number>('ESCORT_PROFILE_PORT'),
      username: this.configService.get<string>('ESCORT_PROFILE_USER'),
      password: this.configService.get<string>('ESCORT_PROFILE_PASS'),
      database: this.configService.get<string>('ESCORT_PROFILE_DB'),
      entities: [EscortProfile, Price, PriceDetail],
      synchronize: false,
    };
  }
}
