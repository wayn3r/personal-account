import { Cycle } from '@/cycles/domain'
import { MongoCycleDocument } from '../schemas'
import { Types } from 'mongoose'
import { Id } from '@/shared/domain/entities'

export class MongoCycleMapper {
  map(cycle: MongoCycleDocument): Cycle {
    const CycleInstance = class extends Cycle {
      static load(): Cycle {
        return new Cycle({
          id: Id.load(cycle._id.toString()),
          name: cycle.name,
          userId: Id.load(cycle.userId.toString()),
          startDate: cycle.startDate,
          endDate: cycle.endDate,
          transactions: cycle.transactions.map((t) => Id.load(t.toString())),
          createdAt: cycle.createdAt,
          updatedAt: cycle.updatedAt,
        })
      }
    }

    return CycleInstance.load()
  }

  reverse(cycle: Cycle): MongoCycleDocument {
    return {
      _id: new Types.ObjectId(cycle.id.toString()),
      userId: new Types.ObjectId(cycle.userId.toString()),
      name: cycle.name,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      transactions: cycle.transactions.map((id) => new Types.ObjectId(id.toString())),
      createdAt: cycle.createdAt,
      updatedAt: cycle.updatedAt,
    }
  }
}
