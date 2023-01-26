import { CanActivate, ExecutionContext, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { AuthRepository, AuthRepositoryProvider } from '../domain'
import { DomainError, NotFound, UserRepository, UserRepositoryProvider } from '@/shared/domain'
import { ErrorResponse } from '@/shared/infrastruture'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthRepositoryProvider)
    private readonly authRepository: AuthRepository,
    @Inject(UserRepositoryProvider)
    private readonly userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const token = <string>req.headers['x-token']
    if (!token) throw this.handleError('TOKEN_NOT_FOUND', 'Token header not found, set x-token to a valid token string')

    const tokenResult = await this.authRepository.verify(token)
    if (tokenResult.isFailure()) throw this.handleError('TOKEN_INVALID', 'Token is not valid')

    const externalId = tokenResult.getOrThrow()

    const userResult = (await this.userRepository.findByExternalId(externalId)).flatMap((userOrNull) =>
      userOrNull.validateIsPresent(() => new NotFound(DomainError.of('USER_NOT_FOUND'))),
    )
    if (userResult.isFailure()) throw this.handleError(userResult.getErrorOrThrow().code, 'User not found')

    const user = userResult.getOrThrow()

    req.currentUser = user

    return true
  }

  private handleError(code: string, message = 'Unauthorized'): UnauthorizedException {
    return new UnauthorizedException(
      new ErrorResponse({
        code: code,
        message: message,
        status: HttpStatus.UNAUTHORIZED,
      }),
    )
  }
}
