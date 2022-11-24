import { IsNotEmpty, IsNumber } from 'class-validator';

export class Paginate {
  @IsNotEmpty()
  @IsNumber()
  offset: number = 0;

  @IsNotEmpty()
  @IsNumber()
  limit: number = 10;
}
