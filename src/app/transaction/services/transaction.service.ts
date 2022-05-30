import { InjectModel } from '@nestjs/mongoose'
import { AddTransactionDto } from '../dtos/add-transaction.dto'
import { Model } from 'mongoose'
import {
    Transaction,
    TransactionDocument,
} from 'contexts/transaction/infrastructure/mongo/schemas/transaction.schema'

export class TransactionService {
    constructor(
        @InjectModel(Transaction.name)
        private transactionModel: Model<TransactionDocument>,
    ) {}
    async save(dto: AddTransactionDto): Promise<Transaction> {
        const { date, ...transaction } = dto
        const createdTransaction = new this.transactionModel({
            ...transaction,
            date: new Date(date),
            balance: transaction.credit - transaction.debit,
        })
        return await createdTransaction.save()
    }

    async findAll(): Promise<Transaction[]> {
        return await this.transactionModel.find({})
    }
}
