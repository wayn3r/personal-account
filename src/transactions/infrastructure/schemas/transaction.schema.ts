import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { COLLECTION_NAMES } from 'shared/infrastruture/config'
import { Tag } from '@/transactions/domain'

@Schema({ collection: COLLECTION_NAMES.TRANSACTION, versionKey: false })
export class TransactionDocument {
  @Prop({ required: true, type: String })
  name: string

  @Prop({ type: String })
  description?: string

  @Prop({ required: true, type: Number })
  amount: number

  @Prop({ required: true, type: String })
  currency: string

  @Prop({ required: true, type: String })
  type: string

  @Prop({ required: true, type: String })
  account: string

  @Prop({ required: true, type: [Types.ObjectId], ref: Tag.name, default: [] })
  tags: Types.ObjectId[]

  @Prop({ required: true, type: String, default: 'active' })
  status: string

  @Prop({ required: true, type: Number, default: Date.now })
  date: Date

  @Prop({ required: true, type: Number, default: Date.now })
  createdAt: Date
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDocument)
