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
    const req = { body: { user: {} }};
    const mockCallToGetAll = jest
      .spyOn(cardService, 'getAll')
      .mockImplementation(() => Promise.resolve([]));

    const getResult = await cardController.getAll(req);

    expect(getResult.length).toBeFalsy();
    expect(mockCallToGetAll).toBeCalledTimes(1);
  });

  it('getOne - Should throw not found exception', async () => {
    const req = { body: { user: {} }};
    const mockCallToGetOne = jest
      .spyOn(cardService, 'getOne')
      .mockImplementation(() => Promise.resolve(null));

    expect(async () => {
      await cardController.getOne(req, '637bba0eba3db50d94514c61');
      expect(mockCallToGetOne).toBeCalledTimes(1);
    })
    .rejects
    .toThrow(NotFoundException);
  });

  it('getOne - Should return a card', async () => {
    const req = { body: { user: {} }};
    const mockCallToGetOne = jest
      .spyOn(cardService, 'getOne')
      .mockImplementation(() => Promise.resolve(new Card()));

    const getResult = await cardController.getOne(req, '637bba0eba3db50d94514c61');

    expect(getResult).toBeTruthy();
    expect(mockCallToGetOne).toBeCalledTimes(1);
  });

  it('create - Should create a new card', async () => {
    const req = { body: { user: { id: '637bb1b36498d6eec023ce55' } }};
    const newCreateCard = new CreateCardDTO();
    newCreateCard.numbers = '5451290126757632';
    newCreateCard.alias = 'Mastercard';

    const mockCallToCreate = jest
      .spyOn(cardService, 'create')
      .mockImplementation(() => Promise.resolve(new Card()));
    const mockCallToEmit = jest
      .spyOn(eventEmitter, 'emit')
      .mockImplementation(() => true);

    await cardController.create(req, newCreateCard);

    expect(mockCallToCreate).toBeCalledTimes(1);
    expect(mockCallToEmit).toBeCalledTimes(1);
  });

  it('deleteOne - Should throw not found exception', async () => {
    const req = { body: { user: { id: '637bb1b36498d6eec023ce55' } }};
    const mockCallToCount = jest
      .spyOn(cardService, 'count')
      .mockImplementation(() => Promise.resolve(0));

    expect(async () => {
      await cardController.deleteOne(req, '637bba0eba3db50d94514c61');
      expect(mockCallToCount).toBeCalledTimes(1);
    })
    .rejects
    .toThrow(NotFoundException);
  });

  it('deleteOne - Should delete a card', async () => {
    const req = { body: { user: { id: '637bb1b36498d6eec023ce55' } }};
    const mockCallToCount = jest
      .spyOn(cardService, 'count')
      .mockImplementationOnce(() => Promise.resolve(1))
      .mockImplementationOnce(() => Promise.resolve(0));
    const mockCallToEmit = jest
      .spyOn(eventEmitter, 'emit')
      .mockImplementationOnce(() => true);

    await cardController.deleteOne(req, '637bba0eba3db50d94514c61');

    expect(mockCallToCount).toBeCalledTimes(2);
    expect(mockCallToEmit).toBeCalledTimes(1);
  });
});
