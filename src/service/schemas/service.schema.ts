import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ versionKey: false })
export class Service {
  _id: string;

  @Prop({ type: SchemaTypes.ObjectId })
  cardId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  customerId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  escortId: Types.ObjectId;

  @Prop()
  price: number;

  @Prop()
  status: string;

  @Prop()
  timeQuantity: number;

  @Prop()
  timeMeasurementUnit: string;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
