import { InjectModel } from '@nestjs/mongoose'
import { Error as MongooseError, Model, Types } from 'mongoose'
import { Id, Optional, Result } from 'shared/domain'
import {
  Tag,
  TagDuplicated,
  TagNameInvalid,
  TagNotFound,
  TagRepository,
} from '@/transactions/domain'
import { TagMapper } from '../mappers'
import { TagDocument } from '../schemas'

export class MongoTagRepository implements TagRepository {
  public constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
    private readonly tagMapper: TagMapper,
  ) {}

  public async createOne(tag: Tag): Promise<Result> {
    try {
      const doc = this.tagMapper.toDocument(tag)
      await this.tagModel.create(doc)
      return Result.ok()
    } catch (error) {
      if (error.constructor instanceof MongooseError.ValidationError) {
        return new TagNameInvalid(tag.name)
      }
      if (error.code === 11000) {
        return new TagDuplicated(tag.name)
      }

      throw error
    }
  }

  public async removeTag(id: Id): Promise<Result> {
    const tag = await this.tagModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id.toString()), active: true },
      { active: false },
    )
    if (!tag) {
      return new TagNotFound(id.toString())
    }
    return Result.ok()
  }

  async findById(id: Id): Promise<Result<Optional<Tag>>> {
    throw new Error('Method not implemented.' + id.toString())
  }
}
