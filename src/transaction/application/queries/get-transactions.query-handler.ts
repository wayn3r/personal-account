import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { PaginationQuery } from 'shared/dtos/pagination-query'
import { Transaction } from 'transaction/domain/transaction'
import { TransactionRepository } from 'transaction/domain/transaction-repository'

export class GetTransactionsQuery implements IQuery {
  constructor(public readonly query: PaginationQuery) {}
}

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsQueryHandler
  implements IQueryHandler<GetTransactionsQuery, Transaction[]>
{
  constructor(
    @Inject(InjectionConfig.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(query: GetTransactionsQuery): Promise<Transaction[]> {
    return await this.transactionRepository.findAll(query.query)
  }
}
