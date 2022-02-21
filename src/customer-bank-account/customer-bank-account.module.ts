import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerBankAccountService } from './customer-bank-account.service';
import { CustomerBankAccount, CustomerBankAccountSchema } from './schemas/customer-bank-account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CustomerBankAccount.name, schema: CustomerBankAccountSchema }]),
  ],
  providers: [CustomerBankAccountService],
  controllers: [],
  exports: [],
})
export class CustomerBankAccountModule { }
