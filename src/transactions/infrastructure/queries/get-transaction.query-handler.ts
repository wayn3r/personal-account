import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { BadRequest, DomainError, Id, Optional, Result } from '@/shared/domain'
import { Transaction, TransactionRepository, TransactionRepositoryProvider } from '@/transactions/domain'

export class GetTransactionQuery implements IQuery {
  private constructor(public readonly userId: Id, public readonly id: Id) {}

  static create(params: { userId: Id; id: Optional<string> }): Result<GetTransactionQuery> {
    const { userId, id } = params
    const idReult = Id.fromNullable(
      id,
      () => new BadRequest(DomainError.of('TRANSACTION_ID_EMPTY')),
      () => new BadRequest(DomainError.of('TRANSACTION_ID_INVALID')),
    )
    return idReult.map((id) => new GetTransactionQuery(userId, id))
  }
}

@QueryHandler(GetTransactionQuery)
export class GetTransactionQueryHandler implements IQueryHandler<GetTransactionQuery, Result<Transaction>> {
  constructor(
    @Inject(TransactionRepositoryProvider)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(query: GetTransactionQuery): Promise<Result<Transaction>> {
    const { userId, id } = query
    return await this.transactionRepository.findOne(userId, id)
  }
}
