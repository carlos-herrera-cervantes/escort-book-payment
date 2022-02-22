import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

export type CustomerBankAccountDocument = CustomerBankAccount & Document;

@Schema({ versionKey: false })
export class CustomerBankAccount {
  _id: string;

  @Prop({ type: SchemaTypes.ObjectId })
  customerId: Types.ObjectId;

  @Prop()
  clabe: string;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;
}

export const CustomerBankAccountSchema = SchemaFactory.createForClass(CustomerBankAccount);

CustomerBankAccountSchema.pre<CustomerBankAccountDocument>('save', function () {
  this.clabe = this.clabe.replace(/.(?=.{4})/g, 'X');
});
