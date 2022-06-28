export class Transaction {
    public readonly id: string
    public readonly name: string
    public readonly amount: number
    public readonly isCredit: boolean
    public readonly description: string
    public readonly date: Date
    public readonly type: string
    public readonly moneyState: string
    public readonly tags: string[]

    public constructor(params: {
        id: string
        name: string
        amount: number
        isCredit: boolean
        description: string
        date: Date
        type: string
        moneyState: string
        tags: string[]
    }) {
        this.id = params.id
        this.name = params.name
        this.amount = params.amount
        this.isCredit = params.isCredit
        this.description = params.description
        this.date = params.date
        this.type = params.type
        this.moneyState = params.moneyState
        this.tags = params.tags
    }
}
