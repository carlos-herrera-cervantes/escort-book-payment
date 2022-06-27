import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
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
  async getAll(@Req() req: any): Promise<Card[]> {
    const customerId: string = req?.body?.user?.id;
    return this.cardService.getAll({ customerId });
  }

  @Get(':id')
  async getOne(@Req() req: any, @Param('id') id: string): Promise<Card> {
    const customerId: string = req?.body?.user?.id;
    const card: Card = await this.cardService.getOne({ customerId, _id: id });

    if (!card) throw new NotFoundException();

    return card;
  }

  @Post()
  async create(@Req() req: any, @Body() card: CreateCardDTO): Promise<Card> {
    const customerId: string = req?.body?.user?.id;

    // TODO: Here we need to call the payment gateway for:
    // 1 - Register a card

    const newCard = new Card();

    newCard.token = 'dummy';
    newCard.customerId = new Types.ObjectId(customerId);
    newCard.numbers = card.numbers;
    newCard.alias = card.alias;

    const created = await this.cardService.create(newCard);

    this.eventEmitter.emit('card.created', customerId);

    return created;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(@Req() req: any, @Param('id') id: string): Promise<void> {
    const customerId = req?.body?.user?.id;
    const counter = await this.cardService.count({ customerId, _id: id });

    if (!counter) throw new NotFoundException();

    // TODO: Here we need to call the payment gateway for:
    // 1 - Delete a card

    await this.cardService.deleteOne({ _id: new Types.ObjectId(id) });
    const remainingCards = await this.cardService.count({ customerId });

    if (!remainingCards) this.eventEmitter.emit('empty.cards', customerId);
  }
}
