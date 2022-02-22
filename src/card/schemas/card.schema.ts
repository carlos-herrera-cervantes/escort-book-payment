import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ versionKey: false })
export class Card {
  _id: string;

  @Prop({ type: SchemaTypes.ObjectId })
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

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;
}

export const CardSchema = SchemaFactory.createForClass(Card);

CardSchema.pre<CardDocument>('save', function () {
  this.numbers = this.numbers.replace(/.(?=.{4})/g, 'X');
});
