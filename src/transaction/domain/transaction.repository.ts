import { GetItemsPaginatedQuery } from 'shared/domain/get-items-paginated-query'
import { PaginatedResponse } from 'shared/domain/paginated-response'
import { RegisterTransaction } from './register-transaction'
import { Transaction } from './transaction'

export interface TransactionRepository {
  findOne(id: string): Promise<Transaction>
  findAll(query: GetItemsPaginatedQuery): Promise<PaginatedResponse<Transaction>>
  register(transaction: RegisterTransaction): Promise<void>
  remove(id: string): Promise<void>
}
