import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Result } from 'shared/domain'
import {
  Transaction,
  TransactionRepository,
  TransactionRepositoryProvider,
} from 'transaction/domain'

export class GetTransactionQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetTransactionQuery)
export class GetTransactionQueryHandler
  implements IQueryHandler<GetTransactionQuery, Result<Transaction>>
{
  constructor(
    @Inject(TransactionRepositoryProvider)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(query: GetTransactionQuery): Promise<Result<Transaction>> {
    const { id } = query
    const result = await this.transactionRepository.findOne(id)
    if (result.isFailure()) {
      return Result.fail(result.getError())
    }
    return Result.ok(result.getOrThrow())
  }
}
