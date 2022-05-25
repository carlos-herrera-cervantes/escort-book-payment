import { CreateCustomerBankAccountDTO } from './create.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCustomerBankAccountDTO extends PartialType(
  CreateCustomerBankAccountDTO,
) {}
