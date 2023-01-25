import { COLLECTION_NAMES } from '@/shared/infrastruture'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ collection: COLLECTION_NAMES.CYCLE, versionKey: false })
export class MongoCycleDocument {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId

  @Prop({ type: Date, default: Date.now, required: true })
  startDate: Date

  @Prop({ type: Date, default: null })
  endDate?: Date

  @Prop({ type: [Types.ObjectId], ref: COLLECTION_NAMES.TRANSACTION })
  transactions: Types.ObjectId[]

  @Prop({ type: Date, default: Date.now, required: true })
  createdAt: Date

  @Prop({ type: Date, default: Date.now, required: true })
  updatedAt: Date
}

export const MongoCycleSchema = SchemaFactory.createForClass(MongoCycleDocument)
