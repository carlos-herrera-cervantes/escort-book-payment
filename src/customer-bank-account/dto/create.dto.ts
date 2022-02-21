import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerBankAccountDTO {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  clabe: string;
}