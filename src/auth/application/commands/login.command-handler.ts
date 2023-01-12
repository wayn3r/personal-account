import { AuthRepository, AuthRepositoryProvider, UserLoggedIn } from '@/auth/domain'
import { BadRequest, DomainError, Optional, Result } from '@/shared/domain'
import { Inject } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'

export class LoginCommand {
  private constructor(public readonly token: string) {}

  static create(token: Optional<string>): Result<LoginCommand> {
    const tokenResult = token
      .validateIsPresent(() => new BadRequest(DomainError.of('EMPTY_TOKEN')))
      .validate(
        (token) => typeof token === 'string',
        () => new BadRequest(DomainError.of('INVALID_TOKEN')),
      )

    return tokenResult.map((token) => new LoginCommand(token))
  }
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand, Result<void>> {
  constructor(
    @Inject(AuthRepositoryProvider)
    private readonly authRepository: AuthRepository,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: LoginCommand): Promise<Result<void>> {
    const { token } = command

    const result = await this.authRepository.verify(token)
    if (result.isFailure()) return result

    const id = result.getOrThrow()
    this.eventBus.publish(new UserLoggedIn(id))
    return Result.ok()
  }
}
