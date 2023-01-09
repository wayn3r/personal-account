import { GetTransactionsController } from './get-transactions.controller'
import { RegisterTransactionController } from './register-transaction.controller'
import { TransactionController } from './transaction.controller'

export * from './transaction.controller'
export * from './register-transaction.controller'
export * from './tag.controller'
export * from './get-transactions.controller'

export const TransactionControllers = [
  TransactionController,
  RegisterTransactionController,
  GetTransactionsController,
]
