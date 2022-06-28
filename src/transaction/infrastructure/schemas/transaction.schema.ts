import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({
  toJSON: {
    transform: (_, doc) => {
      const { _id, ...rest } = doc
      return { id: _id, ...rest }
    },
    versionKey: false,
  },
})
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

  @Prop({ required: true, type: Array, default: [] })
  tags: string[]

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean
}

const TransactionSchema = SchemaFactory.createForClass(TransactionDocument)

export { TransactionDocument, TransactionSchema }
