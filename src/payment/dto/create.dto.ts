import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDTO {
  @IsNotEmpty()
  @IsString()
  escortId: string;

  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  serviceId: string;
}
