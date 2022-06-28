import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { Transaction } from 'transaction/domain/transaction'
import { TransactionRepository } from 'transaction/domain/transaction-repository'

export class GetTransactionQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetTransactionQuery)
export class GetTransactionQueryHandler
  implements IQueryHandler<GetTransactionQuery, Transaction>
{
  constructor(
    @Inject(InjectionConfig.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(query: GetTransactionQuery): Promise<Transaction> {
    const { id } = query
    return await this.transactionRepository.findOne(id)
  }
}
