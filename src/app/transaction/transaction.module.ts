import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
    Transaction,
    TransactionSchema,
} from 'contexts/transaction/infrastructure/mongo/schemas/transaction.schema'
import { GetTransactionController } from './controllers/get-transaction.controller'
import { PostTransactionController } from './controllers/post-transaction.controller'
import { TransactionService } from './services/transaction.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
        ]),
    ],
    controllers: [GetTransactionController, PostTransactionController],
    providers: [TransactionService],
})
export class TransactionModule {}
