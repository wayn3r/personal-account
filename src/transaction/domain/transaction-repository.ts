import { PaginationQuery } from 'shared/dtos/pagination-query'
import { RegisterTransactionDto } from 'transaction/application/dtos/register-transaction.dto'
import { Transaction } from './transaction'

export interface TransactionRepository {
  findOne(id: string): Promise<Transaction>
  findAll(query: PaginationQuery): Promise<Transaction[]>
  register(transaction: RegisterTransactionDto): Promise<void>
  remove(id: string): Promise<void>
}
