import { InjectModel } from '@nestjs/mongoose'
import { InjectionConfig } from 'injection-config'
import { Error as MongoError, Model, QueryOptions, Types } from 'mongoose'
import { Transaction } from 'transaction/domain/transaction'
import { TransactionRepository } from 'transaction/domain/transaction.repository'
import { TransactionMapper } from '../mappers/transaction.mapper'
import { TransactionDocument } from '../schemas/transaction.schema'
import { PaginatedDto } from 'shared/infrastruture/dtos/paginated-dto'
import { GetItemsPaginatedQuery } from 'shared/domain/get-items-paginated-query'
import { PaginatedResponse } from 'shared/domain/paginated-response'
import { RegisterTransaction } from 'transaction/domain/register-transaction'
import { Tag } from 'transaction/domain/tag'
import { Result } from 'shared/domain/result'
import { TransactionError } from 'transaction/domain/transaction-error'

export class MongoTransactionRepository implements TransactionRepository {
  constructor(
    @InjectModel(InjectionConfig.TRANSACTION_MODEL)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  public async findAll(
    query: GetItemsPaginatedQuery,
  ): Promise<Result<PaginatedResponse<Transaction>>> {
    const { limit, page, order } = query
    const onlyActive = { active: true }
    const pagination: QueryOptions = {
      limit,
      skip: (page - 1) * limit,
      sort: { date: order },
    }

    const transactions = await this.transactionModel
      .find(onlyActive, null, pagination)
      .populate({
        path: 'tags',
        select: 'name',
        transform: (tag: Tag) => tag.name,
      })

    return Result.ok(
      new PaginatedDto<Transaction>({
        content: this.transactionMapper.mapList(transactions),
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
        return Result.fail(new Error(TransactionError.INVALID_TRANSACTION))
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
      return Result.fail(new Error(TransactionError.TRANSACTION_NOT_FOUND))
    }
    return Result.ok()
  }

  public async findOne(id: string): Promise<Result<Transaction>> {
    const transaction = await this.transactionModel.findById(new Types.ObjectId(id))

    if (!transaction) {
      return Result.fail(new Error(TransactionError.TRANSACTION_NOT_FOUND))
    }

    return Result.ok(this.transactionMapper.map(transaction))
  }
}
