import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { Cycle, CycleRepository } from '@/cycles/domain'
import { Result } from '@/shared/domain'
import { MongoCycleDocument } from '../schemas'
import { MongoCycleMapper } from '../mappers'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class MongoCycleRepository implements CycleRepository {
  constructor(
    @InjectModel(Cycle.name)
    private readonly mongoCycleModel: Model<MongoCycleDocument>,
    private readonly mongoCycleMapper: MongoCycleMapper,
  ) {}

  async save(cycle: Cycle): Promise<Result<void>> {
    const doc = this.mongoCycleMapper.reverse(cycle)
    console.log(doc)

    return this.mongoCycleModel
      .create(doc)
      .then(() => Result.ok())
      .catch((error) => Result.fail(error))
  }
}
