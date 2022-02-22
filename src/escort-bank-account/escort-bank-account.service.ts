import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CreateEscortBankAccountDTO } from './dto/create.dto';
import { UpdateEscortBankAccountDTO } from './dto/update.dto';
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

  async updateOne(
    account: UpdateEscortBankAccountDTO,
    filter?: FilterQuery<EscortBankAccount>,
  ): Promise<EscortBankAccount> {
    const doc = await this.escortBankAccountModel.findOneAndUpdate(filter, { $set: account }, { new: true });
    await doc.save();
    return doc
  }
}
