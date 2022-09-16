import { TagController } from './infrastructure/controllers/tag.controller'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'
import { MongoTransactionRepository } from './infrastructure/repositories/mongo-transaction.repository'
import { TransactionSchema } from './infrastructure/schemas/transaction.schema'
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
import { TransactionControllers } from './infrastructure'
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
    { provide: TransactionRepositoryProvider, useClass: MongoTransactionRepository },
    { provide: TagRepositoryProvider, useClass: MongoTagRepository },
  ],
})
export class TransactionModule {}
