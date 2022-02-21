import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ServiceStatus } from "../enums/status.enum";

export class CreateServiceDTO {
  @IsNotEmpty()
  @IsString()
  cardId: string;

  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  escortId: string;

  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @IsNotEmpty()
  @IsEnum(ServiceStatus)
  status: ServiceStatus;

  @IsNotEmpty()
  @IsNumber()
  timeQuantity: number;

  @IsNotEmpty()
  @IsString()
  timeMeasurementUnit: string;
}
