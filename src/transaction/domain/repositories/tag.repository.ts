import { Result } from 'shared/domain/result'
import { Tag } from '../entities/tag.entity'

export interface TagRepository {
  createOne(name: string): Promise<Result>
  removeTag(id: string): Promise<Result>
  findAll(): Promise<Result<Tag[]>>
}

export const TagRepositoryProvider = 'TagRepository'
