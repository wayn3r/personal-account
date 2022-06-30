import { TagController } from './infrastructure/tag.controller'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'
import { InjectionConfig } from 'injection-config'
import { MongoTransactionRepository } from './infrastructure/repositories/mongo-transaction.repository'
import { TransactionSchema } from './infrastructure/schemas/transaction.schema'
import { TransactionController } from './infrastructure/transaction.controller'
import { TransactionQueryHandlers } from './application/queries'
import { TransactionCommandHandlers } from './application/commands'
import { TagSchema } from './infrastructure/schemas/tag.schema'
import { MongoTagRepository } from './infrastructure/repositories/mongo-tag.repository'
import { TransactionMappers } from './infrastructure/mappers'

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: InjectionConfig.TAG_MODEL,
        schema: TagSchema,
      },
      {
        name: InjectionConfig.TRANSACTION_MODEL,
        schema: TransactionSchema,
      },
    ]),
  ],
  controllers: [TransactionController, TagController],
  providers: [
    ...TransactionMappers,
    ...TransactionQueryHandlers,
    ...TransactionCommandHandlers,
    {
      provide: InjectionConfig.TRANSACTION_REPOSITORY,
      useClass: MongoTransactionRepository,
    },
    {
      provide: InjectionConfig.TAG_REPOSITORY,
      useClass: MongoTagRepository,
    },
  ],
})
export class TransactionModule {}
