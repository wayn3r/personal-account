import { BadRequest, DomainError, Id, Optional, Result } from 'shared/domain'

type TransactionParams = {
  id: Id
  name: string
  description?: string
  amount: number
  currency: string
  type: string
  account: string
  tags: string[]
  status: string
  date: Date
  createdAt: Date
}

export enum TRANSACTION_STATUS {
  ACTIVE = 'active',
}

export class Transaction {
  public static readonly MIN_NAME_LENGTH = 3
  public static readonly MAX_NAME_LENGTH = 50

  public readonly id: Id
  public readonly name: string
  public readonly description?: string
  public readonly amount: number
  public readonly currency: string
  public readonly type: string
  public readonly account: string
  public readonly tags: string[]
  public readonly status: string
  public readonly date: Date
  public readonly createdAt: Date

  protected constructor(params: TransactionParams) {
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
    tags: Optional<string[]>
    date: Optional<Date>
  }): Result<Transaction> {
    const nameResult = this.validateName(optionalParams.name)
    const descriptionResult = this.validateDescription(optionalParams.description)
    const amountResult = this.validateAmount(optionalParams.amount)
    const currencyResult = this.validateCurrency(optionalParams.currency)
    const typeResult = this.validateType(optionalParams.type)
    const accountResult = this.validateAccount(optionalParams.account)
    const tagsResult = this.validateTags(optionalParams.tags)
    const dateResult = this.validateDate(optionalParams.date)

    return Result.combine(
      nameResult,
      descriptionResult,
      amountResult,
      currencyResult,
      typeResult,
      accountResult,
      tagsResult,
      dateResult,
    ).map(
      ([name, description, amount, currency, type, account, tags, date]) =>
        new Transaction({
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
        }),
    )
  }

  static validateName(nameOrNull: Optional<string>): Result<string> {
    return nameOrNull
      .validateIsPresent(() => new BadRequest(DomainError.of('TRANSACTION_NAME_EMPTY')))
      .validate(
        (name) => typeof name === 'string',
        (name) =>
          new BadRequest(
            DomainError.of('TRANSACTION_NAME_INVALID'),
            `Invalid transaction name: ${name}`,
          ),
      )
      .map((name) => name.trim())
      .validate(
        (name) => name.length >= this.MIN_NAME_LENGTH,
        () => new BadRequest(DomainError.of('TRANSACTION_NAME_TOO_SHORT')),
      )
      .validate(
        (name) => name.length <= this.MAX_NAME_LENGTH,
        () => new BadRequest(DomainError.of('TRANSACTION_NAME_TOO_LONG')),
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

  static validateTags(tagsOrNull: Optional<string[]>): Result<string[]> {
    return tagsOrNull
      .validateIsPresent(() => new BadRequest(DomainError.of('TRANSACTION_TAGS_EMPTY')))
      .validate(
        (tags) => Array.isArray(tags),
        (tags) =>
          new BadRequest(
            DomainError.of('TRANSACTION_TAGS_INVALID'),
            `Invalid transaction tags: ${tags}`,
          ),
      )
      .map((tags) => tags.map((tag) => tag.trim()))
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
