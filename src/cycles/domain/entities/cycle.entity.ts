import { Result, DomainError } from '@/shared/domain'

export class Cycle {
  protected constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly startDate: Date,
    private _transactions: string[],
    private _endDate: Date | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get endDate(): Date | undefined {
    return this._endDate && new Date(this._endDate)
  }

  get transactions(): string[] {
    return [...this._transactions]
  }

  static create(userId: string, startDate = new Date()): Result<Cycle> {
    const today = new Date()
    return Result.ok(new Cycle('', userId, startDate, [], undefined, today, today))
  }

  public addTransaction(transactionId: string): Result<void> {
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
