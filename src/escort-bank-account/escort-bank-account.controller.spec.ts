import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCustomerBankAccountDTO } from '../customer-bank-account/dto/update.dto';
import { CreateEscortBankAccountDTO } from './dto/create.dto';
import { EscortBankAccountController } from './escort-bank-account.controller';
import { EscortBankAccountService } from './escort-bank-account.service';
import { EscortBankAccount } from './schemas/escort-bank-account.schema';

describe('EscortBankAccountController', () => {
  let escortBankAccountService: EscortBankAccountService;
  let escortBankAccountController: EscortBankAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EscortBankAccountService,
          useValue: {
            create: jest.fn(),
            updateOne: jest.fn(),
            getOne: jest.fn(),
          },
        },
      ],
      controllers: [EscortBankAccountController],
    }).compile();
    escortBankAccountService = module.get<EscortBankAccountService>(EscortBankAccountService);
    escortBankAccountController = module.get<EscortBankAccountController>(EscortBankAccountController);
  });

  it('Should be defined', () => expect(escortBankAccountController).toBeDefined());

  it('create - Should create bank account', async () => {
    const req = { body: { user: { id: '637c428e3cf9bfb9f181d19d' } } };
    const createEscortBankAccount = new CreateEscortBankAccountDTO();
    const mockCallToCreate = jest
      .spyOn(escortBankAccountService, 'create')
      .mockImplementation(() => Promise.resolve(new EscortBankAccount()));

    await escortBankAccountController.create(req, createEscortBankAccount);

    expect(mockCallToCreate).toBeCalledTimes(1);
  });

  it('updateOne - Should throw not found exception', async () => {
    const req = { body: { user: { id: '637c428e3cf9bfb9f181d19d' } } };
    const accountId = '637c43ae8ec19029e46a2f09';
    const updateEscortBankAccount = new UpdateCustomerBankAccountDTO();
    const mockCallToGetOne = jest
      .spyOn(escortBankAccountService, 'getOne')
      .mockImplementation(() => Promise.resolve(null));

    expect(async () => {
      await escortBankAccountController.updateOne(req, accountId, updateEscortBankAccount);
      expect(mockCallToGetOne).toBeCalledTimes(1);
    }).rejects.toThrow(NotFoundException);
  });

  it('updateOne - Should update bank account', async () => {
    const req = { body: { user: { id: '637c428e3cf9bfb9f181d19d' } } };
    const accountId = '637c43ae8ec19029e46a2f09';
    const updateEscortBankAccount = new UpdateCustomerBankAccountDTO();
    const mockCallToGetOne = jest
      .spyOn(escortBankAccountService, 'getOne')
      .mockImplementation(() => Promise.resolve(new EscortBankAccount()));
    const mockCallToUpdateOne = jest
      .spyOn(escortBankAccountService, 'updateOne')
      .mockImplementation(() => Promise.resolve(new EscortBankAccount()));

    await escortBankAccountController.updateOne(req, accountId, updateEscortBankAccount);

    expect(mockCallToGetOne).toBeCalledTimes(1);
    expect(mockCallToUpdateOne).toBeCalledTimes(1);
  });
});
