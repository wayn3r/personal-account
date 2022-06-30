import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { OPTIONS } from 'shared/infrastruture/schemas/schema-config'

@Schema({ ...OPTIONS })
class TagDocument extends Document {
  @Prop({ required: true, type: String, unique: true })
  name: string

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean
}

const TagSchema = SchemaFactory.createForClass(TagDocument)

export { TagDocument, TagSchema }
