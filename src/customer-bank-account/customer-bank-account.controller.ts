import { Body, Controller, Inject, NotFoundException, Param, Patch, Post, Req } from '@nestjs/common';
import { CustomerBankAccountService } from './customer-bank-account.service';
import { CreateCustomerBankAccountDTO } from './dto/create.dto';
import { UpdateCustomerBankAccountDTO } from './dto/update.dto';
import { CustomerBankAccount } from './schemas/customer-bank-account.schema';
import { Types } from 'mongoose';

@Controller('/api/v1/payments/bank-account/customer')
export class CustomerBankAccountController {
  @Inject(CustomerBankAccountService)
  private readonly customerBankAccountService: CustomerBankAccountService;

  @Post()
  async create(@Req() req: any, @Body() account: CreateCustomerBankAccountDTO): Promise<CustomerBankAccount> {
    const customerId: string = req?.body?.user?.id;
    account.customerId = customerId;
    
    return this.customerBankAccountService.create(account);
  }

  @Patch(':id')
  async updateOne(
    @Req() req: any,
    @Param('id') id: string,
    @Body() newAccount: UpdateCustomerBankAccountDTO,
  ): Promise<CustomerBankAccount> {
    const customerId: string = req?.body?.user?.id;
    const account: CustomerBankAccount = await this.customerBankAccountService.getOne({
      _id: new Types.ObjectId(id),
      customerId: new Types.ObjectId(customerId),
    });

    if (!account) throw new NotFoundException();

    return this.customerBankAccountService.updateOne(newAccount, { _id: new Types.ObjectId(id) });
  }
}
