import { InjectModel } from '@nestjs/mongoose'
import { Error as MongooseError, Model, Types } from 'mongoose'
import { DomainError, Result } from 'shared/domain'
import { Tag, TagRepository, TransactionError } from 'transaction/domain'
import { TagMapper } from '../mappers'
import { TagDocument } from '../schemas'

export class MongoTagRepository implements TagRepository {
  public constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
    private readonly tagMapper: TagMapper,
  ) {}
  public async createOne(name: string): Promise<Result> {
    try {
      await this.tagModel.create({ name, active: true })
      return Result.ok()
    } catch (error) {
      if (error.constructor instanceof MongooseError.ValidationError) {
        return Result.fail(DomainError.of(TransactionError.INVALID_TAG))
      }
      if (error.code === 11000) {
        return Result.fail(DomainError.of(TransactionError.TAG_ALREADY_EXISTS))
      }

      throw error
    }
  }

  public async removeTag(id: string): Promise<Result> {
    const tag = await this.tagModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), active: true },
      { active: false },
    )
    if (!tag) {
      return Result.fail(DomainError.of(TransactionError.TAG_NOT_FOUND))
    }
    return Result.ok()
  }

  public async findAll(): Promise<Result<Tag[]>> {
    const tags = await this.tagModel.find({ active: true })
    return Result.ok(this.tagMapper.mapList(tags))
  }
}
