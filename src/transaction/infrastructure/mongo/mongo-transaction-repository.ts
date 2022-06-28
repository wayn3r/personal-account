import { NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PaginationQuery } from 'shared/pagination-query'
import { Transaction } from 'transaction/domain/transaction'
import { TransactionQuery } from 'transaction/domain/transaction-query'
import { TransactionRepository } from 'transaction/domain/transaction-repository'
import { TransactionDocument } from './schemas/transaction.schema'

export class MongoTransactionRepository implements TransactionRepository {
    constructor(
        @InjectModel(Transaction.name)
        private readonly transactionModel: Model<TransactionDocument>,
    ) {}

    public async findAll(
        query: PaginationQuery & TransactionQuery,
    ): Promise<Transaction[]> {
        const { name = '', description = '', tags = [], type = '' } = query
        // paginate the results
        const { limit, page } = query
        const paginationQuery = {
            limit,
            offset: (page - 1) * limit,
        }
        const filterQuery = {
            name: { $regex: name, $options: 'i' },
            description: { $regex: description, $options: 'i' },
            tags: { $in: tags },
            type: { $regex: type, $options: 'i' },
        }
        const transactions = await this.transactionModel.find({})
        return transactions.map(
            (t) =>
                new Transaction({
                    id: t._id,
                    name: t.name,
                    ...t,
                }),
        )
    }

    public async createOne(transaction: Transaction): Promise<void> {
        await this.transactionModel.create(transaction)
    }

    public async updateOne(transaction: Transaction): Promise<void> {
        await this.transactionModel.updateOne(
            { _id: transaction.id },
            transaction,
        )
    }

    public async findById(id: string): Promise<Transaction> {
        const transaction = await this.transactionModel.findById(id)

        if (!transaction) {
            throw new NotFoundException('Transaction not found')
        }

        return new Transaction({ id: transaction._id, ...transaction })
    }
}
