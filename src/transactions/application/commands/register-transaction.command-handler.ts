import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { BadRequest, DomainError, Id, Optional, Result } from 'shared/domain'
import {
  Transaction,
  TransactionRepository,
  TransactionRepositoryProvider,
} from '@/transactions/domain'

export class RegisterTransactionCommand implements ICommand {
  private constructor(public readonly transaction: Transaction) {}

  public static create(params: {
    name: Optional<string>
    description: Optional<string>
    amount: Optional<number>
    currency: Optional<string>
    type: Optional<string>
    account: Optional<string>
    tags: Optional<string[]>
    date: Optional<string>
  }): Result<RegisterTransactionCommand> {
    const tagsResult = params.tags
      .replaceIfEmptyWith([])
      .map((tags) =>
        tags.map((tag) =>
          Id.fromNullable(
            Optional.of(String(tag)),
            () => new BadRequest(DomainError.of('TAG_ID_EMPTY')),
            () => new BadRequest(DomainError.of('TAG_ID_INVALID')),
          ),
        ),
      )
      .getResult()
      .flatMap((tagsResult) => Result.combine(...tagsResult))

    const dateResult = params.date
      .replaceIfEmptyWith(new Date().toISOString())
      .map((date) => new Date(date))
      .getResult()

    return Result.combine(tagsResult, dateResult)
      .flatMap(([tags, date]) =>
        Transaction.create({ ...params, tags, date: Optional.of(date) }),
      )
      .map((transaction) => new RegisterTransactionCommand(transaction))
  }
}

@CommandHandler(RegisterTransactionCommand)
export class RegisterTransactionCommandHandler
  implements ICommandHandler<RegisterTransactionCommand, Result>
{
  public constructor(
    @Inject(TransactionRepositoryProvider)
    private readonly transactionRepository: TransactionRepository,
  ) {}
  public async execute(command: RegisterTransactionCommand): Promise<Result> {
    const { transaction } = command
    return await this.transactionRepository.register(transaction)
  }
}
