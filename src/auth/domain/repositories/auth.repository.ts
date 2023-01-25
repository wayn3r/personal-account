import { Optional, Result } from '@/shared/domain/entities'
import { ExternalUser } from '../entities'

export interface AuthRepository {
  verify(token: string): Promise<Result<string>>
  getExternalUser(token: string): Promise<Result<Optional<ExternalUser>>>
}

export const AuthRepositoryProvider = Symbol('AuthRepository')
