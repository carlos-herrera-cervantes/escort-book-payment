import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentMethodCatalogDocument = PaymentMethodCatalog & Document;

@Schema({ versionKey: false })
export class PaymentMethodCatalog {
  _id: string;

  @Prop({ unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;
}

export const PaymentMethodCatalogSchema = SchemaFactory.createForClass(PaymentMethodCatalog);
