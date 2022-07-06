import { GetItemsPaginatedQuery } from 'shared/domain/get-items-paginated-query'
import { PaginatedResponse } from 'shared/domain/paginated-response'
import { Result } from 'shared/domain/result'
import { RegisterTransaction } from './register-transaction'
import { Transaction } from './transaction'

export interface TransactionRepository {
  findOne(id: string): Promise<Result<Transaction>>
  findAll(query: GetItemsPaginatedQuery): Promise<Result<PaginatedResponse<Transaction>>>
  register(transaction: RegisterTransaction): Promise<Result>
  remove(id: string): Promise<Result>
}
