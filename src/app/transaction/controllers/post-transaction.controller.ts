import { Body, Controller, Post } from '@nestjs/common'
import { AddTransactionDto } from '../dtos/add-transaction.dto'
import { TransactionService } from '../services/transaction.service'

@Controller('transaction')
export class PostTransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post('add')
    createTrasaction(@Body() transaction: AddTransactionDto) {
        this.transactionService.save(transaction)
        return transaction
    }
}
