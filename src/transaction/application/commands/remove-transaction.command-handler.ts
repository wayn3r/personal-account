import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { TransactionRepository } from 'transaction/domain/transaction-repository'

export class RemoveTransactionCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(RemoveTransactionCommand)
export class RemoveTransactionCommandHandler
  implements ICommandHandler<RemoveTransactionCommand, void>
{
  constructor(
    @Inject(InjectionConfig.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(command: RemoveTransactionCommand): Promise<void> {
    const { id } = command
    await this.transactionRepository.remove(id)
  }
}
