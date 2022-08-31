import { Mapper } from 'shared/infrastruture/mappers/mapper'
import { Transaction } from 'transaction/domain/entities/transaction.entity'
import { TransactionDocument } from '../schemas/transaction.schema'

export class TransactionMapper extends Mapper<TransactionDocument, Transaction> {
  public map(from: TransactionDocument): Transaction {
    return new Transaction({
      id: from._id,
      name: from.name,
      amount: from.amount,
      currency: from.currency,
      isCredit: from.isCredit,
      description: from.description,
      date: new Date(from.date),
      type: from.type,
      moneyState: from.moneyState,
      tags: from.tags,
      active: from.active,
    })
  }
}
