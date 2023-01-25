import { AggregateRoot } from './aggregate-root'
import { Id } from './id'
import { Result } from './result'

export class User extends AggregateRoot<User> {
  public readonly id: Id
  public readonly externalId: string
  public readonly name: string
  public readonly lastName: string
  public readonly email: string
  public readonly picture: string
  public readonly locale: string
  public readonly createdAt: Date
  public readonly updatedAt: Date

  static create(params: {
    externalId: string
    name: string
    lastName: string
    email: string
    picture: string
    locale: string
  }): Result<User> {
    const now = new Date()
    return Result.ok(
      new User({
        id: Id.generate(),
        externalId: params.externalId,
        name: params.name,
        lastName: params.lastName,
        email: params.email,
        picture: params.picture,
        locale: params.locale,
        createdAt: now,
        updatedAt: now,
      }),
    )
  }
}
