import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Types } from 'mongoose';
import { MONGODB_URI } from '../src/config/mongo.config';
import { CardService } from '../src/card/card.service';
import { CardModule } from '../src/card/card.module';
import { Card } from '../src/card/schemas/card.schema';

let app: INestApplication;
let cardService: CardService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      EventEmitterModule.forRoot(),
      MongooseModule.forRoot(MONGODB_URI),
      CardModule,
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  cardService = module.get<CardService>(CardService);
});

afterAll(async () => await app.close());

describe('CardService', () => {
  it('getAll - Should return an empty list', async () => {
    const cards = await cardService.getAll();
    expect(cards.length).toBeFalsy();
  });

  it('getOne - Should return null', async () => {
    const card = await cardService.getOne();
    expect(card).toBeFalsy();
  });

  it('count - Should return 0', async () => {
    const counter = await cardService.count();
    expect(counter).toBeFalsy();
  });

  it('create - Should create a card', async () => {
    const newCard = new Card();
    newCard.customerId = new Types.ObjectId('637bbf030c8adf0620482e63');
    newCard.token = 'dummy-token';
    newCard.numbers = '5306271640387822';
    newCard.alias = 'Mastercard';

    await cardService.create(newCard);

    const counter = await cardService.count();
    expect(counter).toBeTruthy();

    await cardService.deleteOne();
  });

  it('deleteOne - Should delete a card', async () => {
    const newCard = new Card();
    newCard.customerId = new Types.ObjectId('637bbf030c8adf0620482e63');
    newCard.token = 'dummy-token';
    newCard.numbers = '5306271640387822';
    newCard.alias = 'Mastercard';

    await cardService.create(newCard);

    const counterBeforeDelete = await cardService.count();
    expect(counterBeforeDelete).toBeTruthy();

    await cardService.deleteOne();

    const counterAfterDelete = await cardService.count();
    expect(counterAfterDelete).toBeFalsy();
  });
});
