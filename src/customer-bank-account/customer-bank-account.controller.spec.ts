import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerBankAccountController } from './customer-bank-account.controller';
import { CustomerBankAccountService } from './customer-bank-account.service';
import { CreateCustomerBankAccountDTO } from './dto/create.dto';
import { UpdateCustomerBankAccountDTO } from './dto/update.dto';
import { CustomerBankAccount } from './schemas/customer-bank-account.schema';

describe('CustomerBankAccountController', () => {
  let customerBankAccountService: CustomerBankAccountService;
  let customerBankAccountController: CustomerBankAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CustomerBankAccountService,
          useValue: {
            create: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
      controllers: [CustomerBankAccountController],
    }).compile();

    customerBankAccountService = module.get<CustomerBankAccountService>(CustomerBankAccountService);
    customerBankAccountController = module.get<CustomerBankAccountController>(CustomerBankAccountController);
  });

  it('create - Should create a customer bank account', async () => {
    const req = { body: { user: { id: '637bcb6acf0018f5714a9da1' } } };
    const newCustomerBankAccount = new CreateCustomerBankAccountDTO();
    newCustomerBankAccount.clabe = '00492499513609840729';
    const mockCallToCreate = jest
      .spyOn(customerBankAccountService, 'create')
      .mockImplementation(() => Promise.resolve(new CustomerBankAccount()));

    await customerBankAccountController.create(req, newCustomerBankAccount);

    expect(mockCallToCreate).toBeCalledTimes(1);
  });

  it('updateOne - Should throw not found exception', async () => {
    const req = { body: { user: { id: '637bcb6acf0018f5714a9da1' } } };
    const bankAccountId = '637bccdef1bc33ce06ddd1fd';
    const newPartialBankAccount = new UpdateCustomerBankAccountDTO();
    newPartialBankAccount.clabe = '00492499513609840729';
    const mockCallToCount = jest
      .spyOn(customerBankAccountService, 'count')
      .mockImplementation(() => Promise.resolve(0));

    expect(async () => {
      await customerBankAccountController.updateOne(req, bankAccountId, newPartialBankAccount);
      expect(mockCallToCount).toBeFalsy();
    })
    .rejects
    .toThrow(NotFoundException);
  });
});
