import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
  @IsString()
  priceId: string;

  @IsNotEmpty()
  @IsNumber()
  timeQuantity: number;

  @IsNotEmpty()
  @IsEnum(TimeUnit)
  timeMeasurementUnit: TimeUnit;
}
