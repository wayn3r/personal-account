import { DomainEvent } from '@/shared/domain/entities'

export class TransactionRegistered extends DomainEvent {
  public readonly eventName = 'transaction.registered'
  public readonly id: string
  public readonly name: string
  public readonly amount: number
  public readonly currency: string
  public readonly type: string
  public readonly account: string
  public readonly date: Date
  public readonly createdAt: Date

  public constructor(params: {
    id: string
    name: string
    amount: number
    currency: string
    type: string
    account: string
    date: Date
    createdAt: Date
  }) {
    super()
    this.id = params.id
    this.name = params.name
    this.amount = params.amount
    this.currency = params.currency
    this.type = params.type
    this.account = params.account
    this.date = params.date
    this.createdAt = params.createdAt
  }
}
