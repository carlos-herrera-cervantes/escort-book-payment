import { IsOptional, IsString } from 'class-validator';

export class UpdateServiceDTO {
  @IsOptional()
  @IsString()
  cardId: string;
}
