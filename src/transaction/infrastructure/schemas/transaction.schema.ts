import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { InjectionConfig } from 'injection-config'
import { Document, Types } from 'mongoose'
import { OPTIONS } from 'shared/infrastruture/schemas/schema-config'

@Schema({ ...OPTIONS })
class TransactionDocument extends Document {
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
    type: [{ type: Types.ObjectId, ref: InjectionConfig.TAG_MODEL }],
    default: [],
  })
  tags: string[]

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean
}

const TransactionSchema = SchemaFactory.createForClass(TransactionDocument)

export { TransactionDocument, TransactionSchema }
