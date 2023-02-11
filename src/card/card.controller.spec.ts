import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CreateCardDTO } from './dto/create.dto';
import { Card } from './schemas/card.schema';

describe('CardController', () => {
  let cardService: CardService;
  let eventEmitter: EventEmitter2
  let cardController: CardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CardService,
          useValue: {
            getAll: jest.fn(),
            getOne: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
      controllers: [CardController],
    }).compile();

    cardService = module.get<CardService>(CardService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    cardController = module.get<CardController>(CardController);
  });

  it('Should be defined', () => expect(cardController).toBeDefined());

  it('getAll - Should return an empty list', async () => {
    const mockCallToGetAll = jest
      .spyOn(cardService, 'getAll')
      .mockImplementation(() => Promise.resolve([]));

    const userId = '63e8016090654f7bac9cc6a4';
    const getResult = await cardController.getAll(userId);

    expect(getResult.length).toBeFalsy();
    expect(mockCallToGetAll).toBeCalledTimes(1);
  });

  it('getOne - Should throw not found exception', async () => {
    const mockCallToGetOne = jest
      .spyOn(cardService, 'getOne')
      .mockImplementation(() => Promise.resolve(null));

    const userId = '63e8016090654f7bac9cc6a4';
    const cardId = '637bba0eba3db50d94514c61';

    expect(async () => {
      await cardController.getOne(userId, cardId);
      expect(mockCallToGetOne).toBeCalledTimes(1);
    })
    .rejects
    .toThrow(NotFoundException);
  });

  it('getOne - Should return a card', async () => {
    const mockCallToGetOne = jest
      .spyOn(cardService, 'getOne')
      .mockImplementation(() => Promise.resolve(new Card()));

    const userId = '63e8016090654f7bac9cc6a4';
    const cardId = '637bba0eba3db50d94514c61';

    const getResult = await cardController.getOne(userId, cardId);

    expect(getResult).toBeTruthy();
    expect(mockCallToGetOne).toBeCalledTimes(1);
  });

  it('create - Should create a new card', async () => {
    const newCreateCard = new CreateCardDTO();
    newCreateCard.numbers = '5451290126757632';
    newCreateCard.alias = 'Mastercard';

    const mockCallToCreate = jest
      .spyOn(cardService, 'create')
      .mockImplementation(() => Promise.resolve(new Card()));
    const mockCallToEmit = jest
      .spyOn(eventEmitter, 'emit')
      .mockImplementation(() => true);

    const userId = '63e8016090654f7bac9cc6a4';

    await cardController.create(userId, newCreateCard);

    expect(mockCallToCreate).toBeCalledTimes(1);
    expect(mockCallToEmit).toBeCalledTimes(1);
  });

  it('deleteOne - Should throw not found exception', async () => {
    const mockCallToCount = jest
      .spyOn(cardService, 'count')
      .mockImplementation(() => Promise.resolve(0));

    const userId = '63e8016090654f7bac9cc6a4';
    const cardId = '637bba0eba3db50d94514c61';

    expect(async () => {
      await cardController.deleteOne(userId, cardId);
      expect(mockCallToCount).toBeCalledTimes(1);
    })
    .rejects
    .toThrow(NotFoundException);
  });

  it('deleteOne - Should delete a card', async () => {
    const mockCallToCount = jest
      .spyOn(cardService, 'count')
      .mockImplementationOnce(() => Promise.resolve(1))
      .mockImplementationOnce(() => Promise.resolve(0));
    const mockCallToEmit = jest
      .spyOn(eventEmitter, 'emit')
      .mockImplementationOnce(() => true);

    const userId = '63e8016090654f7bac9cc6a4';
    const cardId = '637bba0eba3db50d94514c61';

    await cardController.deleteOne(userId, cardId);

    expect(mockCallToCount).toBeCalledTimes(2);
    expect(mockCallToEmit).toBeCalledTimes(1);
  });
});
