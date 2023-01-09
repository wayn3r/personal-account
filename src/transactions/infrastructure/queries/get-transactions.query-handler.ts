import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Result } from 'shared/domain'
import { PaginatedResponse, PaginationQuery } from 'shared/infrastruture'
import { Transaction } from '@/transaction/domain'
import { TransactionResponse } from '../dtos'
import { TransactionDocument } from '../schemas'

export class GetTransactionsQuery implements IQuery {
  private constructor(public readonly pagination: PaginationQuery) {}

  public static create(pagination: PaginationQuery): Result<GetTransactionsQuery> {
    return Result.ok(new GetTransactionsQuery(pagination))
  }
}

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsQueryHandler
  implements
    IQueryHandler<GetTransactionsQuery, Result<PaginatedResponse<TransactionResponse>>>
{
  constructor(
    @InjectModel(Transaction.name)
    private readonly trasanctionModel: Model<TransactionDocument>,
    private readonly transactionMapper: TransactionResponse,
  ) {}

  async execute(
    query: GetTransactionsQuery,
  ): Promise<Result<PaginatedResponse<TransactionResponse>>> {
    const { pagination } = query
    const pipeline = { status: 'active' }

    const total = this.trasanctionModel
      .countDocuments(pipeline)
      .exec()
      .then((total) => Result.ok(total))
      .catch((error) => Result.fail(error))

    const docs = this.trasanctionModel
      .find(pipeline)
      .skip(pagination.skip())
      .limit(pagination.limit)
      .populate('tags')
      .exec()
      .then((transactions) => this.transactionMapper.map(transactions))
      .then((transactions) => Result.ok(transactions))
      .catch((error) => Result.fail(error))

    const results = await Promise.all([total, docs])
    return Result.combine(...results).map(
      ([total, data]) => new PaginatedResponse({ total, data, pagination }),
    )
  }
}
