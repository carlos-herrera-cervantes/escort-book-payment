import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDTO } from './dto/create.dto';
import { Card } from './schemas/card.schema';
import { Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('/api/v1/payments/cards')
export class CardController {
  @Inject(CardService)
  private readonly cardService: CardService;

  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  @Get()
  async getAll(@Headers('userId') userId: string): Promise<Card[]> {
    return this.cardService.getAll({ customerId: userId });
  }

  @Get(':id')
  async getOne(@Headers('userId') userId: string, @Param('id') id: string): Promise<Card> {
    const card: Card = await this.cardService.getOne({ customerId: userId, _id: id });

    if (!card) throw new NotFoundException();

    return card;
  }

  @Post()
  async create(@Headers('userId') userId: string, @Body() card: CreateCardDTO): Promise<Card> {
    // TODO: Here we need to call the payment gateway for:
    // 1 - Register a card

    const newCard = new Card();

    newCard.token = 'dummy';
    newCard.customerId = new Types.ObjectId(userId);
    newCard.numbers = card.numbers;
    newCard.alias = card.alias;

    const created = await this.cardService.create(newCard);

    this.eventEmitter.emit('card.created', userId);

    return created;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(@Headers('userId') userId: string, @Param('id') id: string): Promise<void> {
    const counter = await this.cardService.count({ customerId: userId, _id: id });

    if (!counter) throw new NotFoundException();

    // TODO: Here we need to call the payment gateway for:
    // 1 - Delete a card

    await this.cardService.deleteOne({ _id: new Types.ObjectId(id) });
    const remainingCards = await this.cardService.count({ customerId: userId });

    if (!remainingCards) this.eventEmitter.emit('empty.cards', userId);
  }
}
