import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentMethodCatalogDocument = PaymentMethodCatalog & Document;

@Schema({ versionKey: false, collection: 'payment_methods' })
export class PaymentMethodCatalog {
  _id: string;

  @Prop({ unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  createdAt: Date = new Date();

  @Prop()
  updateAt: Date = new Date();
}

export const PaymentMethodCatalogSchema =
  SchemaFactory.createForClass(PaymentMethodCatalog);
