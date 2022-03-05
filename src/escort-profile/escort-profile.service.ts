import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { EscortProfile } from './entities/escort-profile.entity';

@Injectable()
export class EscortProfileService {
  @InjectRepository(EscortProfile)
  private readonly escortProfileRepository: Repository<EscortProfile>;

  async findOne(filter: FindOneOptions<EscortProfile>): Promise<EscortProfile> {
    return this.escortProfileRepository.findOne(filter);
  }
}
