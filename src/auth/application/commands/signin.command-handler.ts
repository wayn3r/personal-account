import { AuthRepository, AuthRepositoryProvider } from '@/auth/domain'
import {
  BadRequest,
  DomainError,
  NotFound,
  Optional,
  Result,
  User,
  UserRepository,
  UserRepositoryProvider,
} from '@/shared/domain'
import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

export class SigninCommand {
  private constructor(public readonly token: string) {}

  static create(params: { token: Optional<string> }): Result<SigninCommand> {
    const tokenResult = params.token
      .validateIsPresent(() => new BadRequest(DomainError.of('EMPTY_TOKEN')))
      .validate(
        (token) => typeof token === 'string',
        () => new BadRequest(DomainError.of('INVALID_TOKEN')),
      )

    return tokenResult.map((token) => new SigninCommand(token))
  }
}

@CommandHandler(SigninCommand)
export class SigninCommandHandler implements ICommandHandler<SigninCommand, Result<void>> {
  private readonly logger = new Logger(SigninCommandHandler.name)
  constructor(
    @Inject(AuthRepositoryProvider)
    private readonly authRepository: AuthRepository,
    @Inject(UserRepositoryProvider)
    private readonly userRepository: UserRepository,
  ) {}
  async execute(command: SigninCommand): Promise<Result<void>> {
    const { token } = command

    const result = await this.authRepository.verify(token)
    if (result.isFailure()) return result

    const id = result.getOrThrow()

    this.saveUser(id, token)

    return Result.ok()
  }

  private async saveUser(externalId: string, token: string): Promise<void> {
    const userExistsResult = await this.userRepository
      .findByExternalId(externalId)
      .then((result) => result.map((userOrNull) => userOrNull.isPresent()))
    if (userExistsResult.isFailure()) return

    const userExists = userExistsResult.getOrThrow()
    if (userExists) return this.logger.debug('User already exists')

    const externalUserResult = await this.authRepository
      .getExternalUser(token)
      .then((result) =>
        result.flatMap((profileOrNull) =>
          profileOrNull.validateIsPresent(() => new NotFound(DomainError.of('USER_NOT_FOUND'))),
        ),
      )
    if (externalUserResult.isFailure()) return this.logger.error(externalUserResult.toString())

    const externalUser = externalUserResult.getOrThrow()

    const userResult = User.create({
      externalId: externalUser.id,
      name: externalUser.name,
      email: externalUser.email.id,
      lastName: externalUser.lastName,
      picture: externalUser.picture,
      locale: externalUser.locale,
    })
    if (userResult.isFailure()) return

    const user = userResult.getOrThrow()

    await this.userRepository.save(user)
  }
}
