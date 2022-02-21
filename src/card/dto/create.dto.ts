import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCardDTO {
  @IsNotEmpty()
  @IsString()
  cvv: string;

  @IsOptional()
  @IsString()
  expiration: string;

  @IsNotEmpty()
  @IsString()
  numbers: string;

  @IsNotEmpty()
  @IsString()
  alias: string;
}
