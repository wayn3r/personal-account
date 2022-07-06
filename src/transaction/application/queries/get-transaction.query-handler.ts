import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { Result } from 'shared/domain/result'
import { Transaction } from 'transaction/domain/transaction'
import { TransactionRepository } from 'transaction/domain/transaction.repository'

export class GetTransactionQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetTransactionQuery)
export class GetTransactionQueryHandler
  implements IQueryHandler<GetTransactionQuery, Result<Transaction>>
{
  constructor(
    @Inject(InjectionConfig.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(query: GetTransactionQuery): Promise<Result<Transaction>> {
    const { id } = query
    const result = await this.transactionRepository.findOne(id)
    if (result.isFailure) {
      return Result.fail(result.getError())
    }
    return Result.ok(result.getValue())
  }
}
