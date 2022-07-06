import { InjectModel } from '@nestjs/mongoose'
import { InjectionConfig } from 'injection-config'
import { Error as MongooseError, Model, Types } from 'mongoose'
import { Result } from 'shared/domain/result'
import { Tag } from 'transaction/domain/tag'
import { TagRepository } from 'transaction/domain/tag.repository'
import { TransactionError } from 'transaction/domain/transaction-error'
import { TagMapper } from '../mappers/tag.mapper'
import { TagDocument } from '../schemas/tag.schema'

export class MongoTagRepository implements TagRepository {
  public constructor(
    @InjectModel(InjectionConfig.TAG_MODEL)
    private readonly tagModel: Model<TagDocument>,
    private readonly tagMapper: TagMapper,
  ) {}
  public async createOne(name: string): Promise<Result> {
    try {
      await this.tagModel.create({ name, active: true })
      return Result.ok()
    } catch (error) {
      if (error.constructor instanceof MongooseError.ValidationError) {
        return Result.fail(new Error(TransactionError.INVALID_TAG))
      }
      if (error.code === 11000) {
        return Result.fail(new Error(TransactionError.TAG_ALREADY_EXISTS))
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
      return Result.fail(new Error(TransactionError.TAG_NOT_FOUND))
    }
    return Result.ok()
  }

  public async findAll(): Promise<Result<Tag[]>> {
    const tags = await this.tagModel.find({ active: true })
    return Result.ok(this.tagMapper.mapList(tags))
  }
}
