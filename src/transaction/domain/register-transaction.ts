export interface RegisterTransaction {
  name: string
  amount: number
  currency: string
  type: string
  moneyState: string
  isCredit?: boolean
  description?: string
  date?: number
  tags?: string[]
}
