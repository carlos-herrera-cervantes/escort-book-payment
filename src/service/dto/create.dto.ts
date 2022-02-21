import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ServiceStatus } from '../enums/status.enum';
import { TimeUnit } from '../enums/time-unit.enum';

export class CreateServiceDTO {
  @IsNotEmpty()
  @IsString()
  cardId: string;

  @IsOptional()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  escortId: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsEnum(ServiceStatus)
  status: ServiceStatus = ServiceStatus.Boarding;

  @IsNotEmpty()
  @IsNumber()
  timeQuantity: number;

  @IsNotEmpty()
  @IsEnum(TimeUnit)
  timeMeasurementUnit: TimeUnit;
}
