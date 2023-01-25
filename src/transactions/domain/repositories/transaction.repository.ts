import { Result } from '@/shared/domain'
import { Transaction } from '../entities/transaction.entity'

export interface TransactionRepository {
  findOne(id: string): Promise<Result<Transaction>>
  register(transaction: Transaction): Promise<Result>
  remove(id: string): Promise<Result>
}

export const TransactionRepositoryProvider = 'TransactionRepository'
