import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCardDTO {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  numbers: string;

  @IsNotEmpty()
  @IsString()
  alias: string;
}