import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type DevolutionDocument = Devolution & Document;

@Schema({ versionKey: false, collection: 'devolutions' })
export class Devolution {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  customerId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  escortId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  serviceId: Types.ObjectId;

  @Prop()
  logRequest: string;

  @Prop()
  logResponse: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DevolutionSchema = SchemaFactory.createForClass(Devolution);

DevolutionSchema.pre<DevolutionDocument>('save', function () {
  if (this.isNew) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
});
