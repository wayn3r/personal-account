import { GetTransactionsController } from './get-transactions.controller'
import { RegisterTransactionController } from './register-transaction.controller'
import { RemoveTransactionController } from './remove-transaction.controller'

export * from './remove-transaction.controller'
export * from './register-transaction.controller'
export * from './tag.controller'
export * from './get-transactions.controller'

export const TransactionControllers = [
  RemoveTransactionController,
  RegisterTransactionController,
  GetTransactionsController,
]
