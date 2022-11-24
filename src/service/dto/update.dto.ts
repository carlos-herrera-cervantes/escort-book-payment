import { IsOptional, IsString } from 'class-validator';

export class UpdateService {
  @IsOptional()
  @IsString()
  cardId: string;
}
