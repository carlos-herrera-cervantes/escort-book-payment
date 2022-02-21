import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EscortBankAccountDocument = EscortBankAccount & Document;

@Schema({ versionKey: false })
export class EscortBankAccount {
  _id: string;

  @Prop()
  escortId: Types.ObjectId;

  @Prop()
  clabe: string;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;
}

export const EscortBankAccountSchema = SchemaFactory.createForClass(EscortBankAccount);
