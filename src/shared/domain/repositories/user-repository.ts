import { Optional, Result, User } from '../entities'

export interface UserRepository {
  save(user: User): Promise<Result<void>>
  findByExternalId(externalId: string): Promise<Result<Optional<User>>>
}

export const UserRepositoryProvider = Symbol('UserRepository')
