import { CreateEscortBankAccountDTO } from './create.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateEscortBankAccountDTO extends PartialType(
  CreateEscortBankAccountDTO,
) {}
