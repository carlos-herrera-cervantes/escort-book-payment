import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TimeUnit } from '../enums/time-unit.enum';

export class CalculateTotalServiceDTO {
  @IsNotEmpty()
  @IsString()
  priceId: string;

  @IsNotEmpty()
  @IsNumber()
  timeQuantity: number;

  @IsNotEmpty()
  @IsEnum(TimeUnit)
  timeMeasurementUnit: TimeUnit;

  @IsOptional()
  @IsArray()
  details: CreateServiceDetailDTO[] = [];
}

export class CreateServiceDTO extends CalculateTotalServiceDTO {
  @IsOptional()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  escortId: string;

  @IsNotEmpty()
  @IsArray()
  paymentDetails: CreatePaymentDetailDTO[] = [];

  @IsOptional()
  @IsBoolean()
  partialPayment: boolean = false;
}

export class CreateServiceDetailDTO {
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsNotEmpty()
  @IsString()
  cost: number;
}

export class CreatePaymentDetailDTO {
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;

  @IsNotEmpty()
  quantity: number;
}
