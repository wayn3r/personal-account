import { PaginatedDto } from 'shared/infrastruture/dtos/paginated-dto'
import { PaginationQuery } from 'shared/infrastruture/dtos/pagination-query'
import { RegisterTransactionDto } from 'transaction/infrastructure/dtos/register-transaction.dto'
import { Transaction } from './transaction'

export interface TransactionRepository {
  findOne(id: string): Promise<Transaction>
  findAll(query: PaginationQuery): Promise<PaginatedDto<Transaction>>
  register(transaction: RegisterTransactionDto): Promise<void>
  remove(id: string): Promise<void>
}
