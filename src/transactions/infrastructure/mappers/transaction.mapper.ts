import { Types } from 'mongoose'
import { Id } from '@/shared/domain/entities'
import { Mapper } from 'shared/infrastruture/mappers/mapper'
import { Transaction } from '@/transactions/domain'
import { TransactionDocument } from '../schemas/transaction.schema'

type MongoDocument = TransactionDocument & { _id: Types.ObjectId }

export class TransactionMapper extends Mapper<MongoDocument, Transaction> {
  public map(from: MongoDocument): Transaction {
    const TransactionInstance = class extends Transaction {
      static load(): Transaction {
        return new Transaction({
          id: Id.load(from._id.toString()),
          name: from.name,
          amount: from.amount,
          currency: from.currency,
          account: from.account,
          description: from.description,
          date: new Date(from.date),
          type: from.type,
          tags: from.tags.map((tag) => Id.load(tag.toString())),
          status: from.status,
          createdAt: new Date(from.createdAt),
        })
      }
    }

    return TransactionInstance.load()
  }

  public reverseMap(from: Transaction): MongoDocument {
    const document = new TransactionDocument() as MongoDocument

    document._id = new Types.ObjectId(from.id.toString())
    document.name = from.name
    document.description = from.description
    document.amount = from.amount
    document.currency = from.currency
    document.type = from.type
    document.account = from.account
    document.tags = from.tags.map((tagId) => new Types.ObjectId(tagId.toString()))
    document.status = from.status
    document.date = from.date
    document.createdAt = from.createdAt

    return document
  }
}
