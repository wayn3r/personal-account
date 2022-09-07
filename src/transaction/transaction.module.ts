import { TagController } from './infrastructure/tag.controller'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'
import { MongoTransactionRepository } from './infrastructure/repositories/mongo-transaction.repository'
import { TransactionSchema } from './infrastructure/schemas/transaction.schema'
import { TransactionController } from './infrastructure/transaction.controller'
import { TransactionQueryHandlers } from './infrastructure/queries'
import { TransactionCommandHandlers } from './application/commands'
import { TagSchema } from './infrastructure/schemas/tag.schema'
import { MongoTagRepository } from './infrastructure/repositories/mongo-tag.repository'
import { TransactionMappers } from './infrastructure/mappers'
import {
  Tag,
  TagRepositoryProvider,
  Transaction,
  TransactionRepositoryProvider,
} from './domain'
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController, TagController],
  providers: [
    ...TransactionMappers,
    ...TransactionQueryHandlers,
    ...TransactionCommandHandlers,
    { provide: TransactionRepositoryProvider, useClass: MongoTransactionRepository },
    { provide: TagRepositoryProvider, useClass: MongoTagRepository },
  ],
})
export class TransactionModule {}
