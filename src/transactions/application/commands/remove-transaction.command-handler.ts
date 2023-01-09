import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import {
  TransactionRepository,
  TransactionRepositoryProvider,
} from '@/transactions/domain'

export class RemoveTransactionCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(RemoveTransactionCommand)
export class RemoveTransactionCommandHandler
  implements ICommandHandler<RemoveTransactionCommand, void>
{
  constructor(
    @Inject(TransactionRepositoryProvider)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(command: RemoveTransactionCommand): Promise<void> {
    const { id } = command
    await this.transactionRepository.remove(id)
  }
}
