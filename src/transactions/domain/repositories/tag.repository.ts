import { Id, Optional, Result } from '@/shared/domain'
import { Tag } from '../entities/tag.entity'

export interface TagRepository {
  createOne(name: Tag): Promise<Result>
  removeTag(userId: Id, id: Id): Promise<Result>
  findById(userId: Id, id: Id): Promise<Result<Optional<Tag>>>
}

export const TagRepositoryProvider = 'TagRepository'
