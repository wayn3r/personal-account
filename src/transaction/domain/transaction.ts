export class Transaction {
  public readonly id: string
  public readonly name: string
  public readonly amount: number
  public readonly currency: string
  public readonly isCredit: boolean
  public readonly description: string
  public readonly date: Date
  public readonly type: string
  public readonly moneyState: string
  public readonly tags: string[]
  public readonly active: boolean

  public constructor(params: {
    id: string
    name: string
    amount: number
    currency: string
    isCredit: boolean
    description: string
    date: Date
    type: string
    moneyState: string
    tags: string[]
    active: boolean
  }) {
    this.id = params.id
    this.name = params.name
    this.amount = params.amount
    this.currency = params.currency
    this.isCredit = params.isCredit
    this.description = params.description
    this.date = params.date
    this.type = params.type
    this.moneyState = params.moneyState
    this.tags = params.tags
    this.active = params.active
  }
}
