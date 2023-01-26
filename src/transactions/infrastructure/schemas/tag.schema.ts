import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { COLLECTION_NAMES } from 'shared/infrastruture/config'

@Schema({ collection: COLLECTION_NAMES.TAG, versionKey: false })
export class TagDocument {
  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean
}

export const TagSchema = SchemaFactory.createForClass(TagDocument)
