import { Id } from '@/shared/domain/entities'
import { Types } from 'mongoose'
import { Mapper } from 'shared/infrastruture'
import { Tag } from '@/transactions/domain'
import { TagDocument } from '../schemas'

type MongoDocument = TagDocument & { _id: Types.ObjectId }

export class TagMapper extends Mapper<MongoDocument, Tag> {
  public map(from: MongoDocument): Tag {
    const TagInstance = class extends Tag {
      static load(): Tag {
        return new Tag({
          id: Id.load(from._id.toString()),
          name: from.name,
          active: from.active,
        })
      }
    }
    return TagInstance.load()
  }

  public reverseMap(from: Tag): MongoDocument {
    const document = new TagDocument() as MongoDocument

    document._id = new Types.ObjectId(from.id.toString())
    document.name = from.name
    document.active = from.active

    return document
  }
}
