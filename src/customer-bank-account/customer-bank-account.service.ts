import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CreateCustomerBankAccountDTO } from './dto/create.dto';
import { UpdateCustomerBankAccountDTO } from './dto/update.dto';
import { CustomerBankAccount, CustomerBankAccountDocument } from './schemas/customer-bank-account.schema';

@Injectable()
export class CustomerBankAccountService {
  @InjectModel(CustomerBankAccount.name)
  private readonly customerBankAccountModel: Model<CustomerBankAccountDocument>;

  async getOne(filter?: FilterQuery<CustomerBankAccount>): Promise<CustomerBankAccount> {
    return this.customerBankAccountModel.findOne(filter);
  }

  async create(account: CreateCustomerBankAccountDTO): Promise<CustomerBankAccount> {
    return this.customerBankAccountModel.create(account);
  }

  async updateOne(
    account: UpdateCustomerBankAccountDTO,
    filter?: FilterQuery<CustomerBankAccount>,
  ): Promise<CustomerBankAccount> {
    const doc = await this.customerBankAccountModel.findOneAndUpdate(filter, { $set: account }, { new: true });
    await doc.save();
    return doc;
  }
}
