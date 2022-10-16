import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDetailDocument = ServiceDetail & Document;

@Schema({ versionKey: false, collection: 'service_detail' })
export class ServiceDetail {
  _id: string;

  @Prop()
  serviceId: string;

  @Prop()
  serviceName: string;

  @Prop()
  cost: number;

  @Prop()
  createdAt: Date = new Date();

  @Prop()
  updatedAt: Date = new Date();
}

export const ServiceDetailSchema = SchemaFactory.createForClass(ServiceDetail);

ServiceDetailSchema.pre<ServiceDetailDocument>('save', function () {
  this.updatedAt = new Date();
});
