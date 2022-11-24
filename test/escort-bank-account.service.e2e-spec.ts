import { INestApplication } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MONGODB_URI } from '../src/config/mongo.config';
import { EscortBankAccount } from '../src/escort-bank-account/schemas/escort-bank-account.schema';
import { EscortBankAccountService } from '../src/escort-bank-account/escort-bank-account.service';
import { EscortBankAccountModule } from '../src/escort-bank-account/escort-bank-account.module';
import { CreateEscortBankAccountDTO } from '../src/escort-bank-account/dto/create.dto';
import { UpdateEscortBankAccountDTO } from '../src/escort-bank-account/dto/update.dto';

let app: INestApplication;
let escortBankAccountService: EscortBankAccountService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      EventEmitterModule.forRoot(),
      MongooseModule.forRoot(MONGODB_URI),
      EscortBankAccountModule,
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  escortBankAccountService = module.get<EscortBankAccountService>(EscortBankAccountService);
});

afterAll(async () => await app.close());

describe('EscortBankAccountService', () => {
  it('getOne - Should return null', async () => {
    const account: EscortBankAccount | null = await escortBankAccountService.getOne();
    expect(account).toBeFalsy();
  });

  it('create - Should create bank account', async () => {
    const createEscortBankAccount = new CreateEscortBankAccountDTO();
    createEscortBankAccount.escortId = '637c608a6755b1ebaf8afebf';
    createEscortBankAccount.clabe = '032180000118567800';

    await escortBankAccountService.create(createEscortBankAccount);

    const counter: number = await escortBankAccountService.count();
    expect(counter).toBeTruthy();

    await escortBankAccountService.deleteMany();
  });

  it('updateOne - Should update bank account', async () => {
    const createEscortBankAccount = new CreateEscortBankAccountDTO();
    createEscortBankAccount.escortId = '637c608a6755b1ebaf8afebf';
    createEscortBankAccount.clabe = '032180000118567800';

    await escortBankAccountService.create(createEscortBankAccount);

    const updateEscortBankAccount = new UpdateEscortBankAccountDTO();
    updateEscortBankAccount.clabe = '032180000118561055';

    await escortBankAccountService.updateOne(updateEscortBankAccount, { escortId: '637c608a6755b1ebaf8afebf' });

    const getResult: EscortBankAccount | null = await escortBankAccountService.getOne({
      escortId: '637c608a6755b1ebaf8afebf',
    });
    expect(getResult.clabe).toEqual('XXXXXXXXXXXXXX1055');

    await escortBankAccountService.deleteMany();
  });
});
