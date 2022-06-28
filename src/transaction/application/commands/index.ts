import { RegisterTransactionCommandHandler } from './register-transaction.command-handler'
import { RemoveTransactionCommandHandler } from './remove-transaction.command-handler'

export const TransactionCommandHandlers = [
  RegisterTransactionCommandHandler,
  RemoveTransactionCommandHandler,
]
