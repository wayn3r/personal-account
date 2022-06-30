import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { Tag } from 'transaction/domain/tag'
import { TagRepository } from 'transaction/domain/tag.repository'

export class GetTags implements IQuery {}

@QueryHandler(GetTags)
export class GetTagsQueryHandler implements IQueryHandler<GetTags, Tag[]> {
  public constructor(
    @Inject(InjectionConfig.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(): Promise<Tag[]> {
    return await this.tagRepository.findAll()
  }
}
