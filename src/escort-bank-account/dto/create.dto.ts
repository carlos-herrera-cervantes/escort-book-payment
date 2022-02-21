import { IsNotEmpty, IsString } from "class-validator";

export class CreateEscortBankAccountDTO {
  @IsNotEmpty()
  @IsString()
  escortId: string;

  @IsNotEmpty()
  @IsString()
  clabe: string;
}
