import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ versionKey: false })
export class Service {
  _id: string;

  @Prop()
  cardId: Types.ObjectId;

  @Prop()
  customerId: Types.ObjectId;

  @Prop()
  escortId: Types.ObjectId;

  @Prop()
  price: number;

  @Prop()
  status: string;

  @Prop()
  timeQuantity: number;

  @Prop()
  timeMeasurementUnit: number;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
