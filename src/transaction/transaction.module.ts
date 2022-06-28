import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'
import { InjectionConfig } from 'injection-config'
import { GetTransactionController } from './application/transaction.controller'
import { TransactionMapper } from './infrastructure/mappers/transaction.mapper'
import { MongoTransactionRepository } from './infrastructure/repositories/mongo-transaction.repository'
import { TransactionSchema } from './infrastructure/schemas/transaction.schema'
import { TransactionQueryHandlers } from './application/queries'
import { TransactionCommandHandlers } from './application/commands'

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: InjectionConfig.TRANSACTION_MODEL,
        schema: TransactionSchema,
      },
    ]),
  ],
  controllers: [GetTransactionController],
  providers: [
    TransactionMapper,
    ...TransactionQueryHandlers,
    ...TransactionCommandHandlers,
    {
      provide: InjectionConfig.TRANSACTION_REPOSITORY,
      useClass: MongoTransactionRepository,
    },
  ],
})
export class TransactionModule {}
