import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type EscortBankAccountDocument = EscortBankAccount & Document;

@Schema({ versionKey: false })
export class EscortBankAccount {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  escortId: Types.ObjectId;

  @Prop()
  clabe: string;

  @Prop({ default: new Date().toUTCString() })
  createdAt: Date;

  @Prop({ default: new Date().toUTCString() })
  updateAt: Date;
}

export const EscortBankAccountSchema = SchemaFactory.createForClass(EscortBankAccount);

EscortBankAccountSchema.pre<EscortBankAccountDocument>('save', function () {
  this.clabe = this.clabe.replace(/.(?=.{4})/g, 'X');
});
