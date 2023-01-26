import { AggregateRoot, Id, Optional, Result } from '@/shared/domain'
import { TagNameEmpty, TagNameInvalid, TagNameTooShort } from '../errors'

const MIN_TAG_NAME_LENGTH = 3
export class Tag extends AggregateRoot<Tag> {
  public readonly id: Id
  public readonly userId: Id
  public readonly name: string
  public readonly active: boolean

  static create(params: { userId: Id; name: Optional<string> }): Result<Tag> {
    const { userId, name } = params
    return name
      .validateIsPresent(() => new TagNameEmpty())
      .validate(
        (value) => typeof value === 'string',
        (value) => new TagNameInvalid(String(value)),
      )
      .map((name) => name.trim())
      .validate(
        (name) => name.length >= MIN_TAG_NAME_LENGTH,
        (name) => new TagNameTooShort(name),
      )
      .map((name) => new Tag({ id: Id.generate(), userId, name, active: true }))
  }
}
