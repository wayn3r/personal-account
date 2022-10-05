import { Id, Optional } from '@/shared/domain'
import { Result } from 'shared/domain/result'
import { Tag } from '../entities/tag.entity'

export interface TagRepository {
  createOne(name: Tag): Promise<Result>
  removeTag(id: Id): Promise<Result>
  findById(id: Id): Promise<Result<Optional<Tag>>>
}

export const TagRepositoryProvider = 'TagRepository'
