import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { PaymentMethodCatalog } from './payment-method-catalog.schema';

export type PaymentUserDocument = PaymentUser & Document;

@Schema({ versionKey: false, collection: 'user_payments' })
export class PaymentUser {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'PaymentMethodCatalog' })
  paymentMethodId: PaymentMethodCatalog | Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  userId: Types.ObjectId;

  @Prop()
  createdAt: Date = new Date();

  @Prop()
  updateAt: Date = new Date();
}

export const PaymentUserSchema = SchemaFactory.createForClass(PaymentUser);
