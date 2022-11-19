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
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PaymentMethodCatalogSchema = SchemaFactory.createForClass(PaymentMethodCatalog);

PaymentMethodCatalogSchema.pre<PaymentMethodCatalogDocument>('save', function () {
  if (this.isNew) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
});
