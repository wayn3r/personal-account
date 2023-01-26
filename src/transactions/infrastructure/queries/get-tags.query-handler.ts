import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Id, Result } from '@/shared/domain'
import { Tag } from '@/transactions/domain'
import { TagResponse } from '../dtos'
import { TagDocument } from '../schemas'

export class GetTags implements IQuery {
  private constructor(public readonly userId: Id) {}

  public static create(userId: Id): Result<GetTags> {
    return Result.ok(new GetTags(userId))
  }
}

@QueryHandler(GetTags)
export class GetTagsQueryHandler implements IQueryHandler<GetTags, Result<TagResponse[]>> {
  public constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
    private readonly tagMapper: TagResponse,
  ) {}

  public async execute(query: GetTags): Promise<Result<TagResponse[]>> {
    return this.tagModel
      .find({ userId: new Types.ObjectId(query.userId.toString()), active: true })
      .exec()
      .then((tags) => Result.ok(this.tagMapper.map(tags)))
      .catch((error) => Result.fail(error))
  }
}
