import { Tag } from './tag'

export interface TagRepository {
  createOne(name: string): Promise<void>
  removeTag(id: string): Promise<void>
  findAll(): Promise<Tag[]>
}
