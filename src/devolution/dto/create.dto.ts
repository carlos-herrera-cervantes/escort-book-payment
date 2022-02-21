import { IsNotEmpty, IsString } from "class-validator";

export class CreateDevolutionDTO {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  escortId: string;

  @IsNotEmpty()
  @IsString()
  serviceId: string;
}
