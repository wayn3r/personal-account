import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { TransactionRepository, TransactionRepositoryProvider } from '@/transactions/domain'
import { BadRequest, DomainError, Id, Optional, Result } from '@/shared/domain'

export class RemoveTransactionCommand implements ICommand {
  private constructor(public readonly userId: Id, public readonly id: Id) {}
  static create(params: { userId: Id; id: Optional<string> }): Result<RemoveTransactionCommand> {
    const { userId, id } = params
    const idReult = Id.fromNullable(
      id,
      () => new BadRequest(DomainError.of('TRANSACTION_ID_EMPTY')),
      () => new BadRequest(DomainError.of('TRANSACTION_ID_INVALID')),
    )
    return idReult.map((id) => new RemoveTransactionCommand(userId, id))
  }
}

@CommandHandler(RemoveTransactionCommand)
export class RemoveTransactionCommandHandler implements ICommandHandler<RemoveTransactionCommand, void> {
  constructor(
    @Inject(TransactionRepositoryProvider)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(command: RemoveTransactionCommand): Promise<void> {
    const { userId, id } = command
    await this.transactionRepository.remove(userId, id)
  }
}
