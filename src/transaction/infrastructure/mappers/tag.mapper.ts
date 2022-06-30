import { Mapper } from 'shared/domain/mapper'
import { Tag } from 'transaction/domain/tag'
import { TagDocument } from '../schemas/tag.schema'

export class TagMapper extends Mapper<TagDocument, Tag> {
  public map(from: TagDocument): Tag {
    return new Tag({
      id: from._id,
      name: from.name,
      active: from.active,
    })
  }
}
