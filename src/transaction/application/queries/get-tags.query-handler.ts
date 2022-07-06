import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { Result } from 'shared/domain/result'
import { Tag } from 'transaction/domain/tag'
import { TagRepository } from 'transaction/domain/tag.repository'

export class GetTags implements IQuery {}

@QueryHandler(GetTags)
export class GetTagsQueryHandler implements IQueryHandler<GetTags, Result<Tag[]>> {
  public constructor(
    @Inject(InjectionConfig.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(): Promise<Result<Tag[]>> {
    const result = await this.tagRepository.findAll()
    if (result.isFailure) {
      return Result.fail(result.getError())
    }
    return Result.ok(result.getValue())
  }
}
