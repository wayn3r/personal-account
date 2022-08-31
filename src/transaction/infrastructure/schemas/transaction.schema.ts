import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { COLLECTION_NAMES } from 'shared/infrastruture/config'
import { Tag } from 'transaction/domain'

@Schema({ collection: COLLECTION_NAMES.TRANSACTION, versionKey: false })
export class TransactionDocument extends Document {
  @Prop({ required: true, type: String })
  name: string

  @Prop({ type: String })
  description: string

  @Prop({ required: true, type: Number, default: Date.now })
  date: Date

  @Prop({ required: true, type: Number })
  amount: number

  @Prop({ required: true, type: String })
  currency: string

  @Prop({ required: true, type: Boolean, default: false })
  isCredit: boolean

  @Prop({ required: true, type: String })
  type: string

  @Prop({ required: true, type: String })
  moneyState: string

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: Tag.name }],
    default: [],
  })
  tags: string[]

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDocument)
