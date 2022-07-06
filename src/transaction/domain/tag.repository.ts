import { Result } from 'shared/domain/result'
import { Tag } from './tag'

export interface TagRepository {
  createOne(name: string): Promise<Result>
  removeTag(id: string): Promise<Result>
  findAll(): Promise<Result<Tag[]>>
}
