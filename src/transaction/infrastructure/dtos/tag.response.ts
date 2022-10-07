import { ResponseMapper } from '@/shared/infrastruture'
import { Expose, Type } from 'class-transformer'

export class TagResponse extends ResponseMapper {
  @Expose({ name: '_id' })
  @Type(() => String)
  id: string

  @Expose()
  name: string
}
