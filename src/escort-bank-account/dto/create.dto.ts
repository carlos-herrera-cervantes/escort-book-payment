import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEscortBankAccountDTO {
  @IsOptional()
  @IsString()
  escortId: string;

  @IsNotEmpty()
  @IsString()
  clabe: string;
}
