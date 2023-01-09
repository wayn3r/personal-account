import {
  Result,
  DomainError,
  Id,
  AggregateRoot,
  BadRequest,
  Conflict,
} from '@/shared/domain'

export class Cycle extends AggregateRoot<Cycle> {
  public readonly id: Id
  public readonly name: string
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

  static create(name: string, userId: Id, startDate = new Date()): Result<Cycle> {
    const today = new Date()
    return Result.ok(
      new Cycle({
        id: Id.generate(),
        name,
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
    if (this._endDate) return new BadRequest(DomainError.of('CYCLE_ALREADY_CLOSED'))

    const hasTransaction = this._transactions.includes(transactionId)
    if (hasTransaction) return new Conflict(DomainError.of('TRANSACTION_ALREADY_EXISTS'))

    this._transactions.push(transactionId)
    return Result.ok()
  }

  public closeCycle(date: Date, now = new Date()): Result<void> {
    if (this._endDate) return new Conflict(DomainError.of('CYCLE_ALREADY_CLOSED'))

    if (date.getTime() <= this.startDate.getTime()) {
      return new BadRequest(DomainError.of('END_DATE_BEFORE_START_DATE'))
    }

    if (date.getTime() > now.getTime()) {
      return new BadRequest(DomainError.of('END_DATE_AFTER_NOW'))
    }

    this._endDate = date
    return Result.ok()
  }
}
