import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Result } from 'shared/domain'
import { Tag, TagRepository, TagRepositoryProvider } from 'transaction/domain'

export class GetTags implements IQuery {}

@QueryHandler(GetTags)
export class GetTagsQueryHandler implements IQueryHandler<GetTags, Result<Tag[]>> {
  public constructor(
    @Inject(TagRepositoryProvider)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(): Promise<Result<Tag[]>> {
    const result = await this.tagRepository.findAll()
    if (result.isFailure()) {
      return Result.fail(result.getError())
    }
    return Result.ok(result.getOrThrow())
  }
}
