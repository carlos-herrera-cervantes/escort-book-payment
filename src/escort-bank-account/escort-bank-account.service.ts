import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CreateEscortBankAccountDTO } from './dto/create.dto';
import { EscortBankAccount, EscortBankAccountDocument } from './schemas/escort-bank-account.schema';

@Injectable()
export class EscortBankAccountService {
  @InjectModel(EscortBankAccount.name)
  private readonly escortBankAccountModel: Model<EscortBankAccountDocument>;

  async getOne(filter?: FilterQuery<EscortBankAccount>): Promise<EscortBankAccount> {
    return this.escortBankAccountModel.findOne(filter).lean();
  }

  async create(account: CreateEscortBankAccountDTO): Promise<EscortBankAccount> {
    return this.escortBankAccountModel.create(account);
  }
}
