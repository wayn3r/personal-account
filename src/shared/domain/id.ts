import { Optional } from './optional'
import { Failure, Result } from './result'

export class Id {
  private constructor(public readonly value: string) {
    if (!value) {
      throw new Error('Id cannot be empty')
    }
  }

  fromNullable(
    value: Optional<string>,
    emptyError: () => Failure,
    invalidError: (invalidValue: any) => Failure,
  ): Result<Id> {
    return value
      .validateIsPresent(emptyError)
      .validate(Id.isValidId, invalidError)
      .map((value) => new Id(value))
  }

  public equals(id: Id): boolean {
    return this.value === id.value
  }

  public toString(): string {
    return this.value
  }

  static isValidId(id: string): boolean {
    const isString = typeof id === 'string'
    return isString && /^[0-9a-fA-F]{24}$/.test(id)
  }

  static generate(): Id {
    const timestamp = ((new Date().getTime() / 1000) | 0).toString(16)
    const sufix = 'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
      .toLowerCase()

    return new Id(timestamp + sufix)
  }

  static load(value: string): Id {
    return new Id(value)
  }
}
