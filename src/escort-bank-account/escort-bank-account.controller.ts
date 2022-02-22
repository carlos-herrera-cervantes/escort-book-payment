import { Body, Controller, Inject, NotFoundException, Param, Patch, Post, Req } from '@nestjs/common';
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
  async create(@Req() req: any, @Body() account: CreateEscortBankAccountDTO): Promise<void> {
    const escortId: string = req?.user?.customerId ?? '6214410974889189120b8774';
    account.escortId = escortId;
    
    await this.escortBankAccountService.create(account);
  }

  @Patch(':id')
  async updateOne(
    @Req() req: any,
    @Param('id') id: string,
    @Body() newAccount: UpdateEscortBankAccountDTO,
  ): Promise<EscortBankAccount> {
    const customerId: string = req?.user?.customerId;
    const account: EscortBankAccount = await this.escortBankAccountService.getOne({
      _id: new Types.ObjectId(id),
      customerId: new Types.ObjectId(customerId),
    });

    if (!account) throw new NotFoundException();

    return this.escortBankAccountService.updateOne(newAccount, { _id: new Types.ObjectId(id) });
  }
}
