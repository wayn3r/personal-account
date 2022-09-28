import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { DomainError, Result } from 'shared/domain'
import {
  TagRepository,
  TagRepositoryProvider,
  TransactionError,
} from 'transaction/domain'

export class CreateTagCommand implements ICommand {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<CreateTagCommand> {
    if (!name) {
      return Result.fail(DomainError.of(TransactionError.INVALID_TAG))
    }
    if (typeof name !== 'string') {
      return Result.fail(DomainError.of(TransactionError.INVALID_TAG))
    }
    const trimmedValue = name.trim()
    if (trimmedValue.length === 0) {
      return Result.fail(DomainError.of(TransactionError.INVALID_TAG))
    }
    return Result.ok(new this(name))
  }
}

@CommandHandler(CreateTagCommand)
export class CreateTagCommandHandler
  implements ICommandHandler<CreateTagCommand, Result>
{
  constructor(
    @Inject(TagRepositoryProvider)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(command: CreateTagCommand): Promise<Result> {
    const result = await this.tagRepository.createOne(command.name)
    if (result.isFailure()) {
      return Result.fail(result.getErrorOrThrow())
    }
    return Result.ok()
  }
}
