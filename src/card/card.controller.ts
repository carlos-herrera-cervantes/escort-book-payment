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

@Controller('/api/v1/payments/cards')
export class CardController {
  @Inject(CardService)
  private readonly cardService: CardService;

  @Get()
  async getAll(@Req() req: any): Promise<Card[]> {
    const customerId: string = req?.body?.user?.id;
    return this.cardService.getAll({ customerId: new Types.ObjectId(customerId) });
  }

  @Get(':id')
  async getOne(@Req() req: any, @Param('id') id: string): Promise<Card> {
    const customerId: string = req?.body?.user?.id;
    const card: Card = await this.cardService.getOne({
      customerId: new Types.ObjectId(customerId),
      _id: new Types.ObjectId(id),
    });

    if (!card) throw new NotFoundException();

    return card;
  }

  @Post()
  async create(@Req() req: any, @Body() card: CreateCardDTO): Promise<Card> {
    const customerId: string = req?.body?.user?.id;
    const newCard = new Card();

    newCard.token = 'dummy';
    newCard.customerId = new Types.ObjectId(customerId);
    newCard.numbers = card.numbers;
    newCard.alias = card.alias;

    return this.cardService.create(newCard);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(@Req() req: any, @Param('id') id: string): Promise<void> {
    const customerId: string = req?.body?.user?.id;
    const card: Card = await this.cardService.getOne({
      customerId: new Types.ObjectId(customerId),
      _id: new Types.ObjectId(id),
    });

    if (!card) throw new NotFoundException();

    await this.cardService.deleteOne({ _id: new Types.ObjectId(id) });
  }
}