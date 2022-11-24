import { INestApplication } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerBankAccountModule } from '../src/customer-bank-account/customer-bank-account.module';
import { MONGODB_URI } from '../src/config/mongo.config';
import { CustomerBankAccountService } from '../src/customer-bank-account/customer-bank-account.service';
import { CustomerBankAccount } from '../src/customer-bank-account/schemas/customer-bank-account.schema';
import { CreateCustomerBankAccountDTO } from '../src/customer-bank-account/dto/create.dto';
import { UpdateCustomerBankAccountDTO } from '../src/customer-bank-account/dto/update.dto';

let app: INestApplication;
let customerBankAccountService: CustomerBankAccountService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      EventEmitterModule.forRoot(),
      MongooseModule.forRoot(MONGODB_URI),
      CustomerBankAccountModule,
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  customerBankAccountService = module.get<CustomerBankAccountService>(CustomerBankAccountService);
});

afterAll(async () => await app.close());

describe('CustomerBankAccountService', () => {
  it('getOne - Should return null', async () => {
    const bankAccount: CustomerBankAccount = await customerBankAccountService.getOne();
    expect(bankAccount).toBeFalsy();
  });

  it('count - Should return 0', async () => {
    const counter: number = await customerBankAccountService.count();
    expect(counter).toBeFalsy();
  });

  it('create - Should create a bank account', async () => {
    const createCustomerBankAccount = new CreateCustomerBankAccountDTO();
    createCustomerBankAccount.customerId = '637bd5b08ccc5121bc03bcd8';
    createCustomerBankAccount.clabe = '00492499513609840729';

    await customerBankAccountService.create(createCustomerBankAccount);

    const counter: number = await customerBankAccountService.count();
    expect(counter).toBeTruthy();

    await customerBankAccountService.deleteMany();
  });

  it('updateOne - Should update a bank account', async () => {
    const createCustomerBankAccount = new CreateCustomerBankAccountDTO();
    createCustomerBankAccount.customerId = '637bd5b08ccc5121bc03bcd8';
    createCustomerBankAccount.clabe = '00492499513609840729';

    await customerBankAccountService.create(createCustomerBankAccount);

    const updateCustomerBankAccount = new UpdateCustomerBankAccountDTO();
    updateCustomerBankAccount.clabe = '00492499513609840800';

    await customerBankAccountService.updateOne(updateCustomerBankAccount, {
      customerId: '637bd5b08ccc5121bc03bcd8',
    });

    const getResult = await customerBankAccountService.getOne({
      customerId: '637bd5b08ccc5121bc03bcd8',
    });

    expect(getResult.clabe).toEqual('XXXXXXXXXXXXXXXX0800');

    await customerBankAccountService.deleteMany();
  });
});
