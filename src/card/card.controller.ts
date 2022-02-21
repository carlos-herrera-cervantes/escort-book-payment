import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Req } from '@nestjs/common';
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
    const customerId: string = req?.user?.customerId;
    return this.cardService.getAll({ customerId });
  }

  @Get(':id')
  async getOne(@Req() req: any): Promise<Card> {
    const customerId: string = req?.user?.customerId;
    return this.cardService.getOne({ customerId });
  }

  @Post()
  async create(@Req() req: any, @Body() card: CreateCardDTO): Promise<Card> {
    const customerId: string = req?.user?.customerId;
    const newCard = new Card();

    newCard.token = 'dummy';
    newCard.customerId = new Types.ObjectId(customerId);

    return this.cardService.create(newCard);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(@Req() req: any, @Param('id') id: string): Promise<void> {
    const customerId: string = req?.user?.customerId;
    return this.cardService.deleteOne({ customerId, _id: id });
  }
}