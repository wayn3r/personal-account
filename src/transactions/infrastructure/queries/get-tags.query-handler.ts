import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Result } from '@/shared/domain'
import { Tag } from '@/transaction/domain'
import { TagResponse } from '../dtos'
import { TagDocument } from '../schemas'

export class GetTags implements IQuery {}

@QueryHandler(GetTags)
export class GetTagsQueryHandler
  implements IQueryHandler<GetTags, Result<TagResponse[]>>
{
  public constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
    private readonly tagMapper: TagResponse,
  ) {}

  public async execute(query: GetTags): Promise<Result<TagResponse[]>> {
    return this.tagModel
      .find({ active: true, ...query })
      .exec()
      .then((tags) => Result.ok(this.tagMapper.map(tags)))
      .catch((error) => Result.fail(error))
  }
}
