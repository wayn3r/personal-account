import { Id, Optional, Result } from '@/shared/domain'
import { TagNameEmpty, TagNameInvalid, TagNameTooShort } from '../errors'

const MIN_TAG_NAME_LENGTH = 3
export class Tag {
  public readonly id: Id
  public readonly name: string
  public readonly active: boolean

  protected constructor(params: { id: Id; name: string; active: boolean }) {
    this.id = params.id
    this.name = params.name
    this.active = params.active
  }

  static create(params: { name: Optional<string> }): Result<Tag> {
    return params.name
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
      .map((name) => new Tag({ id: Id.generate(), name, active: true }))
  }
}
