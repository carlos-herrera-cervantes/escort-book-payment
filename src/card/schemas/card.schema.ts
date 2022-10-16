import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ versionKey: false, collection: 'cards' })
export class Card {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  customerId: Types.ObjectId;

  @Prop()
  token: string;

  @Prop()
  numbers: string;

  @Prop({ default: false })
  default: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  alias: string;

  @Prop()
  createdAt: Date = new Date();

  @Prop()
  updateAt: Date = new Date();
}

export const CardSchema = SchemaFactory.createForClass(Card);

CardSchema.pre<CardDocument>('save', function () {
  this.numbers = this.numbers.replace(/.(?=.{4})/g, 'X');
});
