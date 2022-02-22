import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ versionKey: false })
export class Payment {
  _id: string;

  @Prop({ type: SchemaTypes.ObjectId })
  escortId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  customerId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  serviceId: Types.ObjectId;

  @Prop()
  logRequest: string;

  @Prop()
  logResponse: string;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
