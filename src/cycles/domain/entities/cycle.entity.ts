import { Result, DomainError, Id, AggregateRoot } from '@/shared/domain'

export class Cycle extends AggregateRoot<Cycle> {
  public readonly id: Id
  public readonly userId: Id
  public readonly startDate: Date
  private _transactions: Id[]
  private _endDate: Date | undefined
  public readonly createdAt: Date
  public readonly updatedAt: Date

  get endDate(): Date | undefined {
    return this._endDate && new Date(this._endDate)
  }

  get transactions(): Id[] {
    return [...this._transactions]
  }

  static create(userId: Id, startDate = new Date()): Result<Cycle> {
    const today = new Date()
    return Result.ok(
      new Cycle({
        id: Id.generate(),
        userId,
        startDate,
        transactions: [],
        endDate: undefined,
        createdAt: today,
        updatedAt: today,
      }),
    )
  }

  public addTransaction(transactionId: Id): Result<void> {
    if (this._endDate) return Result.fail(DomainError.of('CYCLE_ALREADY_CLOSED'))

    const hasTransaction = this._transactions.includes(transactionId)
    if (hasTransaction) return Result.fail(DomainError.of('TRANSACTION_ALREADY_EXISTS'))

    this._transactions.push(transactionId)
    return Result.ok()
  }

  public closeCycle(date = new Date()): Result<void> {
    this._endDate = date
    return Result.ok()
  }
}
