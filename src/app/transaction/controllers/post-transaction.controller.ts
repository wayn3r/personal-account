import { Body, Controller, Post } from '@nestjs/common'
import { AddTransactionDto } from '../dtos/add-transaction.dto'
import { TransactionService } from '../services/transaction.service'

@Controller('transaction')
export class PostTransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post('add')
    async createTrasaction(@Body() transaction: AddTransactionDto) {
        return await this.transactionService.save(transaction)
    }
}
