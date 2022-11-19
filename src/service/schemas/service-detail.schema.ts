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
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ServiceDetailSchema = SchemaFactory.createForClass(ServiceDetail);

ServiceDetailSchema.pre<ServiceDetailDocument>('save', function () {
  if (this.isNew) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  this.updatedAt = new Date();
});
