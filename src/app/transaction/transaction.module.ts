import { Module } from '@nestjs/common'
import { GetTransactionController } from './controllers/get-transaction.controller'
import { PostTransactionController } from './controllers/post-transaction.controller'
import { TransactionService } from './services/transaction.service'

@Module({
    imports: [],
    controllers: [GetTransactionController, PostTransactionController],
    providers: [TransactionService],
})
export class TransactionModule {}
