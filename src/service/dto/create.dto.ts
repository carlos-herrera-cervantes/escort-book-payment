import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TimeUnit } from '../enums/time-unit.enum';

export class CalculateTotalService {
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
  details: CreateServiceDetail[] = [];
}

export class CreateService extends CalculateTotalService {
  @IsOptional()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  escortId: string;

  @IsNotEmpty()
  @IsArray()
  paymentDetails: CreatePaymentDetail[] = [];

  @IsOptional()
  @IsBoolean()
  partialPayment = false;
}

export class CreateServiceDetail {
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

export class CreatePaymentDetail {
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;

  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  cardId?: string;
}

export class PaidServiceEvent {
  escortId: string;
  customerId: string;
  serviceCost: number;
  businessCommission: number;
  escortProfit: number;
  operation: string;
  paymentMethods: string[];
  serviceId: string;
}
