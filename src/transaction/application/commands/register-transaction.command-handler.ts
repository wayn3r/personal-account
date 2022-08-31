import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { TransactionRepository, TransactionRepositoryProvider } from 'transaction/domain'
import { RegisterTransaction } from 'transaction/domain/register-transaction'

export class RegisterTransactionCommand implements ICommand {
  public constructor(public readonly transaction: RegisterTransaction) {}
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
