import { TransactionError } from 'transaction/domain/transaction-error'
import { Result } from 'shared/domain/result'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { TagRepository } from 'transaction/domain/tag.repository'

export class CreateTagCommand implements ICommand {
  private constructor(public readonly name: string) {}

  static create(name: string): Result<CreateTagCommand> {
    if (!name) {
      return Result.fail(new Error(TransactionError.INVALID_TAG))
    }
    if (typeof name !== 'string') {
      return Result.fail(new Error(TransactionError.INVALID_TAG))
    }
    const trimmedValue = name.trim()
    if (trimmedValue.length === 0) {
      return Result.fail(new Error(TransactionError.INVALID_TAG))
    }
    return Result.ok(new this(name))
  }
}

@CommandHandler(CreateTagCommand)
export class CreateTagCommandHandler
  implements ICommandHandler<CreateTagCommand, Result>
{
  constructor(
    @Inject(InjectionConfig.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(command: CreateTagCommand): Promise<Result> {
    const result = await this.tagRepository.createOne(command.name)
    if (result.isFailure) {
      return Result.fail(result.getError())
    }
    return Result.ok()
  }
}
