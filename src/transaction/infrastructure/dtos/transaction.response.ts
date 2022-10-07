import { ResponseMapper } from '@/shared/infrastruture'
import { Expose, Type } from 'class-transformer'
import { TagResponse } from './tag.response'

export class TransactionResponse extends ResponseMapper {
  @Expose({ name: '_id' })
  @Type(() => String)
  public id: string

  @Expose()
  public name: string

  @Expose()
  description?: string

  @Expose()
  amount: number

  @Expose()
  currency: string

  @Expose()
  type: string

  @Expose()
  account: string

  @Expose()
  @Type(() => TagResponse)
  tags: TagResponse[]

  @Expose()
  status: string

  @Expose()
  date: Date

  @Expose()
  createdAt: Date
}
