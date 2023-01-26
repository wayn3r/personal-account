import { InjectModel } from '@nestjs/mongoose'
import { Model, QueryOptions, Types } from 'mongoose'
import { DomainError, Id, NotFound, Result } from '@/shared/domain'
import { PaginatedResponse, PaginationQuery } from 'shared/infrastruture'
import { Tag, Transaction, TransactionError, TransactionRepository } from '@/transactions/domain'
import { TransactionMapper } from '../mappers'
import { TransactionDocument } from '../schemas'

export class MongoTransactionRepository implements TransactionRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  public async findAll(query: PaginationQuery): Promise<Result<PaginatedResponse<Transaction>>> {
    const { limit, page } = query
    const onlyActive = { active: true }
    const pagination: QueryOptions = {
      limit,
      skip: (page - 1) * limit,
      sort: { date: -1 },
    }

    const [total, transactions] = await Promise.all([
      this.transactionModel.countDocuments(onlyActive).exec(),
      this.transactionModel
        .find(onlyActive, null, pagination)
        .populate({
          path: 'tags',
          select: 'name',
          transform: (tag: Tag) => tag.name,
        })
        .exec(),
    ])

    return Result.ok(
      new PaginatedResponse<Transaction>({
        data: this.transactionMapper.mapList(transactions),
        total,
        pagination: query,
      }),
    )
  }

  public async register(transaction: Transaction): Promise<Result> {
    const document = this.transactionMapper.reverseMap(transaction)
    return this.transactionModel
      .create(document)
      .then(() => Result.ok())
      .catch((error) => Result.fail(error))
  }

  public async remove(userId: Id, id: Id): Promise<Result> {
    const transaction = await this.transactionModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id.toString()),
        userId: new Types.ObjectId(userId.toString()),
        active: true,
      },
      { active: false },
    )
    if (!transaction) {
      return Result.fail(DomainError.of(TransactionError.TRANSACTION_NOT_FOUND))
    }
    return Result.ok()
  }

  public async findOne(userId: Id, id: Id): Promise<Result<Transaction>> {
    const transaction = await this.transactionModel.findOne({
      _id: new Types.ObjectId(id.toString()),
      userId: new Types.ObjectId(userId.toString()),
      active: true,
    })

    if (!transaction) {
      return new NotFound(DomainError.of(TransactionError.TRANSACTION_NOT_FOUND))
    }

    return Result.ok(this.transactionMapper.map(transaction))
  }
}
