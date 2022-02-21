import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ versionKey: false })
export class Card {
  _id: string;

  @Prop()
  customerId: Types.ObjectId;

  @Prop()
  token: string;

  @Prop()
  numbers: string;

  @Prop({ default: true })
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
