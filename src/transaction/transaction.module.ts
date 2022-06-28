import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InjectionConfig } from 'injection-config'
import { TransactionController } from './application/transaction.controller'
import { Transaction } from './domain/transaction'
import { MongoTransactionRepository } from './infrastructure/mongo/mongo-transaction-repository'
import { TransactionSchema } from './infrastructure/mongo/schemas/transaction.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
        ]),
    ],
    controllers: [TransactionController],
    providers: [
        {
            provide: InjectionConfig.TRANSACTION_REPOSITORY,
            useClass: MongoTransactionRepository,
        },
    ],
})
export class TransactionModule {}
