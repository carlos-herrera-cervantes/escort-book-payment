import { Injectable } from '@nestjs/common';
import { Card, CardDocument } from './schemas/card.schema';
import { Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCardDTO } from './dto/create.dto';

@Injectable()
export class CardService {
  @InjectModel(Card.name)
  private readonly cardModel: Model<CardDocument>;

  async getAll(filter?: FilterQuery<Card>): Promise<Card[]> {
    return this.cardModel.find(filter).lean();
  }

  async getOne(filter?: FilterQuery<Card>): Promise<Card> {
    return this.cardModel.findOne(filter).lean();
  }

  async create(card: Card): Promise<Card> {
    return this.cardModel.create(card);
  }

  async deleteOne(filter?: FilterQuery<Card>): Promise<void> {
    return this.cardModel.findOneAndDelete(filter);
  }
}
