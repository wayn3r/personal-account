import { Transaction } from 'transaction/domain/transaction'
import { TransactionDocument } from '../schemas/transaction.schema'

export class TransactionMapper {
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

  public mapList(from: TransactionDocument[]): Transaction[] {
    return from.map((t) => this.map(t))
  }
}
