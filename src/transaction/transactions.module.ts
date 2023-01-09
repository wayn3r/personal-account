import { TagController } from './infrastructure/controllers/tag.controller'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Tag,
  TagRepositoryProvider,
  Transaction,
  TransactionRepositoryProvider,
} from './domain'
import { TransactionCommandHandlers } from './application'
import {
  TransactionControllers,
  TransactionResponses,
  TransactionMappers,
  MongoTagRepository,
  TagSchema,
  TransactionQueryHandlers,
  TransactionSchema,
  MongoTransactionRepository,
} from './infrastructure'
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [...TransactionControllers, TagController],
  providers: [
    ...TransactionMappers,
    ...TransactionQueryHandlers,
    ...TransactionCommandHandlers,
    ...TransactionResponses,
    { provide: TransactionRepositoryProvider, useClass: MongoTransactionRepository },
    { provide: TagRepositoryProvider, useClass: MongoTagRepository },
  ],
})
export class TransactionsModule {}
