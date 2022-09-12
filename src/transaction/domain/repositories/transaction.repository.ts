import { Result } from 'shared/domain/result'
import { PaginatedResponse, PaginationQuery } from 'shared/infrastruture/dtos'
import { Transaction } from '../entities/transaction.entity'

export interface TransactionRepository {
  findOne(id: string): Promise<Result<Transaction>>
  findAll(query: PaginationQuery): Promise<Result<PaginatedResponse<Transaction>>>
  register(transaction: Transaction): Promise<Result>
  remove(id: string): Promise<Result>
}

export const TransactionRepositoryProvider = 'TransactionRepository'
