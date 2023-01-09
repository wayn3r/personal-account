import { Cycle } from '@/cycles/domain'
import { MongoCycleDocument } from '../schemas'
import { Types } from 'mongoose'

export class MongoCycleMapper {
  reverse(cycle: Cycle): MongoCycleDocument {
    return {
      _id: cycle.id ? new Types.ObjectId(cycle.id) : undefined,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      transactions: cycle.transactions.map(
        (transaction) => new Types.ObjectId(transaction),
      ),
      createdAt: cycle.createdAt,
      updatedAt: cycle.updatedAt,
    } as MongoCycleDocument
  }
}
