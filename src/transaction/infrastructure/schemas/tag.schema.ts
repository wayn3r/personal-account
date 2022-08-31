import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { COLLECTION_NAMES } from 'shared/infrastruture/config'

@Schema({ collection: COLLECTION_NAMES.TAG, versionKey: false })
export class TagDocument extends Document {
  @Prop({ required: true, type: String, unique: true })
  name: string

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean
}

export const TagSchema = SchemaFactory.createForClass(TagDocument)
