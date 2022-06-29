import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { PaginatedDto } from 'shared/infrastruture/dtos/paginated-dto'
import { PaginationQuery } from 'shared/infrastruture/dtos/pagination-query'
import { Transaction } from 'transaction/domain/transaction'
import { TransactionRepository } from 'transaction/domain/transaction-repository'

export class GetTransactionsQuery implements IQuery {
  constructor(public readonly query: PaginationQuery) {}
}

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsQueryHandler
  implements IQueryHandler<GetTransactionsQuery, PaginatedDto<Transaction>>
{
  constructor(
    @Inject(InjectionConfig.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(query: GetTransactionsQuery): Promise<PaginatedDto<Transaction>> {
    return await this.transactionRepository.findAll(query.query)
  }
}
