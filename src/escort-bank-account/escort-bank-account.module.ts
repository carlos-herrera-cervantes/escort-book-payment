import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EscortBankAccountController } from './escort-bank-account.controller';
import { EscortBankAccountService } from './escort-bank-account.service';
import {
  EscortBankAccount,
  EscortBankAccountSchema,
} from './schemas/escort-bank-account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EscortBankAccount.name, schema: EscortBankAccountSchema },
    ]),
  ],
  providers: [EscortBankAccountService],
  controllers: [EscortBankAccountController],
  exports: [],
})
export class EscortBankAccountModule {}
