import { Id, Optional, Result } from '@/shared/domain'

export interface AuthRepository {
  verify(token: string): Promise<Result<Id>>
  getProfile(token: string): Promise<Result<Optional<any>>>
}

export const AuthRepositoryProvider = 'AuthRepository'
