import { Id, Optional, Result } from '@/shared/domain/entities'
import { Cycle } from '../entities'

export interface CycleRepository {
  save(cycle: Cycle): Promise<Result<void>>
  update(cycle: Cycle): Promise<Result<void>>
  findById(userId: Id, id: Id): Promise<Result<Optional<Cycle>>>
  findByStartDate(userId: Id, startDate: Date): Promise<Result<Optional<Cycle>>>
}

export const CycleRepositoryProvider = 'CycleRepository'
