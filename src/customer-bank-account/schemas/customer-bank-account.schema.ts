import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CustomerBankAccountDocument = CustomerBankAccount & Document;

@Schema({ versionKey: false })
export class CustomerBankAccount {
  _id: string;

  @Prop()
  customerId: Types.ObjectId;

  @Prop()
  clabe: string;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;
}

export const CustomerBankAccountSchema = SchemaFactory.createForClass(CustomerBankAccount);
