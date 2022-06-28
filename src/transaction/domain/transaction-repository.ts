import { PaginationQuery } from 'shared/pagination-query'
import { Transaction } from './transaction'
import { TransactionQuery } from './transaction-query'

export interface TransactionRepository {
    findAll(query: PaginationQuery & TransactionQuery): Promise<Transaction[]>
    createOne(transaction: Transaction): Promise<void>
    updateOne(transaction: Transaction): Promise<void>
    findById(id: string): Promise<Transaction>
}
