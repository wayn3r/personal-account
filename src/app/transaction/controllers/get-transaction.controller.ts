import { Controller, Get } from '@nestjs/common'
import { Transaction } from 'contexts/transaction/infrastructure/mongo/schemas/transaction.schema'
import { TransactionService } from '../services/transaction.service'

@Controller('transaction')
export class GetTransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get()
    async getAll(): Promise<Transaction[]> {
        return await this.transactionService.findAll()
    }
}
