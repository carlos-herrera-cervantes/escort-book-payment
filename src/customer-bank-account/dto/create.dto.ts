import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerBankAccountDTO {
  @IsOptional()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  clabe: string;
}