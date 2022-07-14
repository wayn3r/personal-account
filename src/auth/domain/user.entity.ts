import { DomainError } from 'shared/domain/domain-error'
import { Result } from 'shared/domain/result'
import { UserErrors } from './user-errors'

export const enum ROL_TYPES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

const MAX_PASSWORD_LENGTH = 20
const MIN_PASSWORD_LENGTH = 6

const MAX_DISPLAY_NAME_LENGTH = 50
const MIN_DISPLAY_NAME_LENGTH = 3

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private password: string,
    private displayName: string,
    public readonly avatarUrl: string,
    public readonly rol: ROL_TYPES,
    public readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  public updateDisplayName(displayName: string): Result {
    if (displayName.length > MAX_DISPLAY_NAME_LENGTH) {
      return Result.fail(DomainError.of(UserErrors.DISPLAY_NAME_TOO_LONG))
    }

    if (displayName.length < MIN_DISPLAY_NAME_LENGTH) {
      return Result.fail(DomainError.of(UserErrors.DISPLAY_NAME_TOO_SHORT))
    }

    this.displayName = displayName
    this.updatedAt = new Date()

    return Result.ok()
  }

  public updatePassword(password: string): Result {
    if (password.length > MAX_PASSWORD_LENGTH) {
      return Result.fail(DomainError.of(UserErrors.PASSWORD_TOO_LONG))
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return Result.fail(DomainError.of(UserErrors.PASSWORD_TOO_SHORT))
    }

    // TODO: implement password hashing
    this.password = password
    this.updatedAt = new Date()

    return Result.ok()
  }

  public getDisplayName(): string {
    return this.displayName
  }

  public getPassword(): string {
    return this.password
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }
}
