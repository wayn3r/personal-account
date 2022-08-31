import { InjectModel } from '@nestjs/mongoose'
import { Error as MongoError, Model, QueryOptions, Types } from 'mongoose'
import { DomainError, Result } from 'shared/domain'
import { PaginatedResponse, PaginationQuery } from 'shared/infrastruture'
import {
  Tag,
  Transaction,
  TransactionError,
  TransactionRepository,
} from 'transaction/domain'
import { RegisterTransaction } from 'transaction/domain/register-transaction'
import { TransactionMapper } from '../mappers'
import { TransactionDocument } from '../schemas'

export class MongoTransactionRepository implements TransactionRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  public async findAll(
    query: PaginationQuery,
  ): Promise<Result<PaginatedResponse<Transaction>>> {
    const { limit, page } = query
    const onlyActive = { active: true }
    const pagination: QueryOptions = {
      limit,
      skip: (page - 1) * limit,
      sort: { date: -1 },
    }

    const transactions = await this.transactionModel
      .find(onlyActive, null, pagination)
      .populate({
        path: 'tags',
        select: 'name',
        transform: (tag: Tag) => tag.name,
      })

    return Result.ok(
      new PaginatedResponse<Transaction>({
        data: this.transactionMapper.mapList(transactions),
        total: await this.transactionModel.countDocuments(onlyActive),
        pagination: query,
      }),
    )
  }

  public async register(transaction: RegisterTransaction): Promise<Result> {
    try {
      await this.transactionModel.create(transaction)
      return Result.ok()
    } catch (error) {
      if (error.constructor instanceof MongoError.ValidationError) {
        return Result.fail(DomainError.of(TransactionError.INVALID_TRANSACTION))
      }
      throw error
    }
  }

  public async remove(id: string): Promise<Result> {
    const transaction = await this.transactionModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), active: true },
      { active: false },
    )
    if (!transaction) {
      return Result.fail(DomainError.of(TransactionError.TRANSACTION_NOT_FOUND))
    }
    return Result.ok()
  }

  public async findOne(id: string): Promise<Result<Transaction>> {
    const transaction = await this.transactionModel.findById(new Types.ObjectId(id))

    if (!transaction) {
      return Result.fail(DomainError.of(TransactionError.TRANSACTION_NOT_FOUND))
    }

    return Result.ok(this.transactionMapper.map(transaction))
  }
}
