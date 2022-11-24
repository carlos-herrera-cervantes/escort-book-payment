import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
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
    account.customerId = req?.body?.user?.id;

    // TODO: Here we need to call the payment gateway for:
    // 1 - Register a bank account

    return this.customerBankAccountService.create(account);
  }

  @Patch(':id')
  async updateOne(
    @Req() req: any,
    @Param('id') id: string,
    @Body() newAccount: UpdateCustomerBankAccountDTO,
  ): Promise<CustomerBankAccount> {
    const customerId: string = req?.body?.user?.id;
    const account: number = await this.customerBankAccountService.count({
      _id: new Types.ObjectId(id),
      customerId: new Types.ObjectId(customerId),
    });

    if (!account) throw new NotFoundException();

    // TODO: Here we need to call the payment gateway for:
    // 1 - Update a bank account

    return this.customerBankAccountService.updateOne(newAccount, {
      _id: new Types.ObjectId(id),
    });
  }
}
