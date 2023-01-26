import { Id, Result } from '@/shared/domain'
import { Transaction } from '../entities/transaction.entity'

export interface TransactionRepository {
  findOne(userId: Id, id: Id): Promise<Result<Transaction>>
  register(transaction: Transaction): Promise<Result>
  remove(userId: Id, id: Id): Promise<Result>
}

export const TransactionRepositoryProvider = 'TransactionRepository'
