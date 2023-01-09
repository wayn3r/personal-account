import { COLLECTION_NAMES } from '@/shared/infrastruture'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ collection: COLLECTION_NAMES.CYCLE })
export class MongoCycle {
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

export type MongoCycleDocument = MongoCycle & Document

export const MongoCycleSchema = SchemaFactory.createForClass(MongoCycle)
