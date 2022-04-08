import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDetailDocument = ServiceDetail & Document;

@Schema({ versionKey: false })
export class ServiceDetail {
  _id: string;

  @Prop()
  serviceId: string;

  @Prop()
  serviceName: string;

  @Prop()
  cost: number;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updatedAt: Date;
}

export const ServiceDetailSchema = SchemaFactory.createForClass(ServiceDetail);
