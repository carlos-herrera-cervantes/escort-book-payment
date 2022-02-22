import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

export type DevolutionDocument = Devolution & Document;

@Schema({ versionKey: false })
export class Devolution {
  _id: string;

  @Prop({ type: SchemaTypes.ObjectId })
  customerId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  escortId: Types.ObjectId;

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

export const DevolutionSchema = SchemaFactory.createForClass(Devolution);
