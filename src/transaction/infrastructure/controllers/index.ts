import { RegisterTransactionController } from './register-transaction.controller'
import { TransactionController } from './transaction.controller'

export * from './transaction.controller'
export * from './register-transaction.controller'
export * from './tag.controller'

export const TransactionControllers = [
  TransactionController,
  RegisterTransactionController,
]
