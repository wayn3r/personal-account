import { NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InjectionConfig } from 'injection-config'
import { Model, Types } from 'mongoose'
import { PaginationQuery } from 'shared/dtos/pagination-query'
import { RegisterTransactionDto } from 'transaction/application/dtos/register-transaction.dto'
import { Transaction } from 'transaction/domain/transaction'
import { TransactionRepository } from 'transaction/domain/transaction-repository'
import { TransactionMapper } from '../mappers/transaction.mapper'
import { TransactionDocument } from '../schemas/transaction.schema'

export class MongoTransactionRepository implements TransactionRepository {
  constructor(
    @InjectModel(InjectionConfig.TRANSACTION_MODEL)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  public async findAll(query: PaginationQuery): Promise<Transaction[]> {
    // paginate the results
    // const { limit, page, order } = query
    // const paginationQuery = {
    //   limit,
    //   offset: (page - 1) * limit,
    // }
    // const filterQuery = {
    //   name: { $regex: name, $options: 'i' },
    //   description: { $regex: description, $options: 'i' },
    //   tags: { $in: tags },
    //   type: { $regex: type, $options: 'i' },
    // }
    const transactions = await this.transactionModel.find({})
    return this.transactionMapper.mapList(transactions)
  }

  public async register(transaction: RegisterTransactionDto): Promise<void> {
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
