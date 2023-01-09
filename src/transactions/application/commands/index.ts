import { CreateTagCommandHandler } from './create-tag.command-handler'
import { RegisterTransactionCommandHandler } from './register-transaction.command-handler'
import { RemoveTagCommandHandler } from './remove-tag.command-handler'
import { RemoveTransactionCommandHandler } from './remove-transaction.command-handler'

export * from './register-transaction.command-handler'
export * from './remove-transaction.command-handler'
export * from './create-tag.command-handler'
export * from './remove-tag.command-handler'

export const TransactionCommandHandlers = [
  RegisterTransactionCommandHandler,
  RemoveTransactionCommandHandler,
  CreateTagCommandHandler,
  RemoveTagCommandHandler,
]
