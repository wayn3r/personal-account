import { NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InjectionConfig } from 'injection-config'
import { Model, QueryOptions, Types } from 'mongoose'
import { Transaction } from 'transaction/domain/transaction'
import { TransactionRepository } from 'transaction/domain/transaction.repository'
import { TransactionMapper } from '../mappers/transaction.mapper'
import { TransactionDocument } from '../schemas/transaction.schema'
import { PaginatedDto } from 'shared/infrastruture/dtos/paginated-dto'
import { GetItemsPaginatedQuery } from 'shared/domain/get-items-paginated-query'
import { PaginatedResponse } from 'shared/domain/paginated-response'
import { RegisterTransaction } from 'transaction/domain/register-transaction'
import { Tag } from 'transaction/domain/tag'

export class MongoTransactionRepository implements TransactionRepository {
  constructor(
    @InjectModel(InjectionConfig.TRANSACTION_MODEL)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  public async findAll(
    query: GetItemsPaginatedQuery,
  ): Promise<PaginatedResponse<Transaction>> {
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

    return new PaginatedDto<Transaction>({
      content: this.transactionMapper.mapList(transactions),
      total: await this.transactionModel.countDocuments(onlyActive),
      pagination: query,
    })
  }

  public async register(transaction: RegisterTransaction): Promise<void> {
    await this.transactionModel.create(transaction)
  }

  public async remove(id: string): Promise<void> {
    const transaction = await this.transactionModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { active: false },
    )
    if (!transaction) {
      throw new NotFoundException('Transaction not found')
    }
  }

  public async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(new Types.ObjectId(id))

    if (!transaction) {
      throw new NotFoundException('Transaction not found')
    }

    return this.transactionMapper.map(transaction)
  }
}
