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
  async create(@Headers('user-id') userId: string, @Body() account: CreateCustomerBankAccountDTO): Promise<CustomerBankAccount> {
    account.customerId = userId

    // TODO: Here we need to call the payment gateway for:
    // 1 - Register a bank account

    return this.customerBankAccountService.create(account);
  }

  @Patch(':id')
  async updateOne(
    @Headers('user-id') userId: string,
    @Param('id') id: string,
    @Body() newAccount: UpdateCustomerBankAccountDTO,
  ): Promise<CustomerBankAccount> {
    const account: number = await this.customerBankAccountService.count({
      _id: new Types.ObjectId(id),
      customerId: new Types.ObjectId(userId),
    });

    if (!account) throw new NotFoundException();

    // TODO: Here we need to call the payment gateway for:
    // 1 - Update a bank account

    return this.customerBankAccountService.updateOne(newAccount, {
      _id: new Types.ObjectId(id),
    });
  }
}
