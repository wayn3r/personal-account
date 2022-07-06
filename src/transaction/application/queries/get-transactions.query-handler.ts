import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { GetItemsPaginatedQuery } from 'shared/domain/get-items-paginated-query'
import { PaginatedResponse } from 'shared/domain/paginated-response'
import { Result } from 'shared/domain/result'
import { Transaction } from 'transaction/domain/transaction'
import { TransactionRepository } from 'transaction/domain/transaction.repository'

export class GetTransactionsQuery implements IQuery {
  constructor(public readonly paginationQuery: GetItemsPaginatedQuery) {}
}

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsQueryHandler
  implements IQueryHandler<GetTransactionsQuery, Result<PaginatedResponse<Transaction>>>
{
  constructor(
    @Inject(InjectionConfig.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(
    query: GetTransactionsQuery,
  ): Promise<Result<PaginatedResponse<Transaction>>> {
    const result = await this.transactionRepository.findAll(query.paginationQuery)
    if (result.isFailure) {
      return Result.fail(result.getError())
    }
    return Result.ok(result.getValue())
  }
}
