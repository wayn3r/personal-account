import { Mapper } from 'shared/infrastruture'
import { Tag } from 'transaction/domain'
import { TagDocument } from '../schemas'

export class TagMapper extends Mapper<TagDocument, Tag> {
  public map(from: TagDocument): Tag {
    return new Tag({
      id: from._id,
      name: from.name,
      active: from.active,
    })
  }
}
