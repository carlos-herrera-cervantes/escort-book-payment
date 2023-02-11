import {
  Body,
  Controller,
  Headers,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEscortBankAccountDTO } from './dto/create.dto';
import { EscortBankAccountService } from './escort-bank-account.service';
import { Types } from 'mongoose';
import { UpdateEscortBankAccountDTO } from './dto/update.dto';
import { EscortBankAccount } from './schemas/escort-bank-account.schema';

@Controller('/api/v1/payments/bank-account/escort')
export class EscortBankAccountController {
  @Inject(EscortBankAccountService)
  private readonly escortBankAccountService: EscortBankAccountService;

  @Post()
  async create(@Headers('user-id') userId: string, @Body() account: CreateEscortBankAccountDTO): Promise<EscortBankAccount> {
    // TODO: Here we need to call the payment gateway for;
    // 1 - Register a bank account

    account.escortId = userId;

    return this.escortBankAccountService.create(account);
  }

  @Patch(':id')
  async updateOne(
    @Headers('user-id') userId: string,
    @Param('id') id: string,
    @Body() newAccount: UpdateEscortBankAccountDTO,
  ): Promise<EscortBankAccount> {
    const account: EscortBankAccount = await this.escortBankAccountService.getOne({
      _id: new Types.ObjectId(id),
      customerId: new Types.ObjectId(userId),
    });

    if (!account) throw new NotFoundException();

    // TODO: Here we need to call the payment gateway for:
    // 1 - Update a bank acount

    return this.escortBankAccountService.updateOne(newAccount, {
      _id: new Types.ObjectId(id),
    });
  }
}
