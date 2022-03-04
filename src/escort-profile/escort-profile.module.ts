import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscortProfile } from './entities/escort-profile.entity';
import { EscortProfileService } from './escort-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([EscortProfile])],
  providers: [EscortProfileService],
  exports: [EscortProfileService],
})
export class EscortProfileModule {}