import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import {
  Transaction,
  TransactionRepository,
  TransactionRepositoryProvider,
} from 'transaction/domain'

export class RegisterTransactionCommand implements ICommand {
  private constructor(public readonly transaction: Transaction) {}
}

@CommandHandler(RegisterTransactionCommand)
export class RegisterTransactionCommandHandler
  implements ICommandHandler<RegisterTransactionCommand, void>
{
  public constructor(
    @Inject(TransactionRepositoryProvider)
    private readonly transactionRepository: TransactionRepository,
  ) {}
  public async execute(command: RegisterTransactionCommand): Promise<void> {
    const { transaction } = command
    await this.transactionRepository.register(transaction)
  }
}
