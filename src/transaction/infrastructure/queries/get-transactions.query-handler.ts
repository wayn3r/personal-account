import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Result } from 'shared/domain'
import { PaginatedResponse, PaginationQuery } from 'shared/infrastruture'
import {
  Transaction,
  TransactionRepository,
  TransactionRepositoryProvider,
} from 'transaction/domain'

export class GetTransactionsQuery implements IQuery {
  constructor(public readonly paginationQuery: PaginationQuery) {}
}

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsQueryHandler
  implements IQueryHandler<GetTransactionsQuery, Result<PaginatedResponse<Transaction>>>
{
  constructor(
    @Inject(TransactionRepositoryProvider)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(
    query: GetTransactionsQuery,
  ): Promise<Result<PaginatedResponse<Transaction>>> {
    const result = await this.transactionRepository.findAll(query.paginationQuery)
    if (result.isFailure()) {
      return Result.fail(result.getErrorOrThrow())
    }
    return Result.ok(result.getOrThrow())
  }
}
