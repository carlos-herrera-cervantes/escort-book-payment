import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ServiceStatus } from '../enums/status.enum';

export class UpdateServiceDTO {
  @IsOptional()
  @IsString()
  cardId: string;
}
