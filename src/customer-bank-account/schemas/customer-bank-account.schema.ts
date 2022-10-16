import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type CustomerBankAccountDocument = CustomerBankAccount & Document;

@Schema({ versionKey: false, collection: 'customer_bank_accounts' })
export class CustomerBankAccount {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  customerId: Types.ObjectId;

  @Prop()
  clabe: string;

  @Prop()
  createdAt: Date = new Date();

  @Prop()
  updateAt: Date = new Date();
}

export const CustomerBankAccountSchema = SchemaFactory.createForClass(CustomerBankAccount);

CustomerBankAccountSchema.pre<CustomerBankAccountDocument>('save', function () {
  this.clabe = this.clabe.replace(/.(?=.{4})/g, 'X');
});
