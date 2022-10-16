import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { PaymentMethodCatalog } from './payment-method-catalog.schema';

export type PaymentDetailDocument = PaymentDetail & Document;

@Schema({ versionKey: false, collection: 'payment_detail' })
export class PaymentDetail {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'PaymentMethodCatalog' })
  paymentMethodId: PaymentMethodCatalog | Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  serviceId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  cardId?: Types.ObjectId;

  @Prop()
  quantity: number;

  @Prop()
  createdAt: Date = new Date();

  @Prop()
  updateAt: Date = new Date();
}

export const PaymentDetailSchema = SchemaFactory.createForClass(PaymentDetail);
