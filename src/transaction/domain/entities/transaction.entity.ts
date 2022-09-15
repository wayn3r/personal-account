import {
  AggregateRoot,
  BadRequest,
  DomainError,
  Id,
  Optional,
  Result,
} from 'shared/domain'
import {
  TransactionNameEmpty,
  TransactionNameInvalid,
  TransactionNameTooLong,
  TransactionNameTooShort,
} from '../errors'
import { TransactionRegistered } from '../events'

type TransactionParams = {
  id: Id
  name: string
  description?: string
  amount: number
  currency: string
  type: string
  account: string
  tags: Id[]
  status: string
  date: Date
  createdAt: Date
}

export enum TRANSACTION_STATUS {
  ACTIVE = 'active',
}

export class Transaction extends AggregateRoot {
  public static readonly MIN_NAME_LENGTH = 3
  public static readonly MAX_NAME_LENGTH = 50

  public readonly id: Id
  public readonly name: string
  public readonly description?: string
  public readonly amount: number
  public readonly currency: string
  public readonly type: string
  public readonly account: string
  public readonly tags: Id[]
  public readonly status: string
  public readonly date: Date
  public readonly createdAt: Date

  protected constructor(params: TransactionParams) {
    super()
    this.id = params.id
    this.name = params.name
    this.description = params.description
    this.amount = params.amount
    this.currency = params.currency
    this.type = params.type
    this.account = params.account
    this.tags = params.tags
    this.status = params.status
    this.date = params.date
    this.createdAt = params.createdAt
  }

  public static create(optionalParams: {
    name: Optional<string>
    description: Optional<string>
    amount: Optional<number>
    currency: Optional<string>
    type: Optional<string>
    account: Optional<string>
    tags: Id[]
    date: Optional<Date>
  }): Result<Transaction> {
    return Result.combine(
      this.validateName(optionalParams.name),
      this.validateDescription(optionalParams.description),
      this.validateAmount(optionalParams.amount),
      this.validateCurrency(optionalParams.currency),
      this.validateType(optionalParams.type),
      this.validateAccount(optionalParams.account),
      this.validateTags(optionalParams.tags),
      this.validateDate(optionalParams.date),
    )
      .map((values) => {
        const [name, description, amount, currency, type, account, tags, date] = values
        return new Transaction({
          id: Id.generate(),
          name,
          description,
          amount,
          currency,
          type,
          account,
          tags,
          date,
          status: TRANSACTION_STATUS.ACTIVE,
          createdAt: new Date(),
        })
      })
      .onSuccess((transaction) => {
        const event = new TransactionRegistered({
          ...transaction,
          id: transaction.id.toString(),
        })
        transaction.addEvent(event)
      })
  }

  static validateName(nameOrNull: Optional<string>): Result<string> {
    return nameOrNull
      .validateIsPresent(() => new TransactionNameEmpty())
      .validate(
        (name) => typeof name === 'string',
        (name) => new TransactionNameInvalid(name),
      )
      .map((name) => name.trim())
      .validate(
        (name) => name.length >= this.MIN_NAME_LENGTH,
        (name) => new TransactionNameTooShort(name),
      )
      .validate(
        (name) => name.length <= this.MAX_NAME_LENGTH,
        (name) => new TransactionNameTooLong(name),
      )
  }

  static validateDescription(descriptionOrNull: Optional<string>): Result<string> {
    return descriptionOrNull
      .replaceIfEmptyWith('')
      .validate(
        (description) => typeof description === 'string',
        (description) =>
          new BadRequest(
            DomainError.of('TRANSACTION_DESCRIPTION_INVALID'),
            `Invalid transaction description: ${description}`,
          ),
      )
      .map((description) => description.trim())
  }

  static validateAmount(amountOrNull: Optional<number>): Result<number> {
    return amountOrNull
      .validateIsPresent(() => new BadRequest(DomainError.of('TRANSACTION_AMOUNT_EMPTY')))
      .validate(
        (amount) => typeof amount === 'number',
        (amount) =>
          new BadRequest(
            DomainError.of('TRANSACTION_AMOUNT_INVALID'),
            `Invalid transaction amount: ${amount}`,
          ),
      )
  }

  static validateCurrency(currencyOrNull: Optional<string>): Result<string> {
    return currencyOrNull
      .validateIsPresent(
        () => new BadRequest(DomainError.of('TRANSACTION_CURRENCY_EMPTY')),
      )
      .validate(
        (currency) => typeof currency === 'string',
        (currency) =>
          new BadRequest(
            DomainError.of('TRANSACTION_CURRENCY_INVALID'),
            `Invalid transaction currency: ${currency}`,
          ),
      )
      .map((currency) => currency.trim())
  }

  static validateType(typeOrNull: Optional<string>): Result<string> {
    return typeOrNull
      .validateIsPresent(() => new BadRequest(DomainError.of('TRANSACTION_TYPE_EMPTY')))
      .validate(
        (type) => typeof type === 'string',
        (type) =>
          new BadRequest(
            DomainError.of('TRANSACTION_TYPE_INVALID'),
            `Invalid transaction type: ${type}`,
          ),
      )
      .map((type) => type.trim())
  }

  static validateAccount(accountOrNull: Optional<string>): Result<string> {
    return accountOrNull
      .validateIsPresent(
        () => new BadRequest(DomainError.of('TRANSACTION_ACCOUNT_EMPTY')),
      )
      .validate(
        (account) => typeof account === 'string',
        (account) =>
          new BadRequest(
            DomainError.of('TRANSACTION_ACCOUNT_INVALID'),
            `Invalid transaction account: ${account}`,
          ),
      )
      .map((account) => account.trim())
  }

  static validateTags(tags: Id[]): Result<Id[]> {
    const noDuplicates = new Set(tags)
    if (noDuplicates.size !== tags.length) {
      return new BadRequest(DomainError.of('TRANSACTION_TAGS_DUPLICATED'))
    }

    return Result.ok(tags)
  }

  static validateDate(dateOrNull: Optional<Date>): Result<Date> {
    return dateOrNull
      .validateIsPresent(() => new BadRequest(DomainError.of('TRANSACTION_DATE_EMPTY')))
      .validate(
        (date) => date instanceof Date,
        (date) =>
          new BadRequest(
            DomainError.of('TRANSACTION_DATE_INVALID'),
            `Invalid transaction date: ${date}`,
          ),
      )
  }
}
