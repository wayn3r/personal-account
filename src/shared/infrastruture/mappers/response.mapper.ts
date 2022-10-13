import { plainToInstance } from 'class-transformer'

export class ResponseMapper {
  map(data: any[]): this[] {
    const constructor = (this as any).__proto__.constructor
    return plainToInstance(constructor, data, { excludeExtraneousValues: true })
  }
}
