import { Injectable } from '@nestjs/common'
import { AddTransactionDto } from '../dtos/add-transaction.dto'

@Injectable()
export class TransactionService {
    async save(transaction: AddTransactionDto) {
        console.log(transaction)
    }
}
