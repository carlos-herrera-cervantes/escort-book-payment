import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaginateDTO {
  @IsNotEmpty()
  @IsNumber()
  offset: number;

  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
