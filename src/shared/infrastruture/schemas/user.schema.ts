import { COLLECTION_NAMES } from '@/shared/infrastruture'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ collection: COLLECTION_NAMES.USER, versionKey: false })
export class MongoUserDocument {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId

  @Prop({ type: String, required: true, unique: true })
  externalId: string

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  lastName: string

  @Prop({ type: String, required: true, unique: true })
  email: string

  @Prop({ type: String })
  locale: string

  @Prop({ type: String })
  picture: string

  @Prop({ type: Date, default: Date.now, required: true })
  createdAt: Date

  @Prop({ type: Date, default: Date.now, required: true })
  updatedAt: Date
}

export const MongoUserSchema = SchemaFactory.createForClass(MongoUserDocument)
