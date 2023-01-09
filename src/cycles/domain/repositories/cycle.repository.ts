import { Id, Optional, Result } from '@/shared/domain'
import { Cycle } from '../entities'

export interface CycleRepository {
  save(cycle: Cycle): Promise<Result<void>>
  update(cycle: Cycle): Promise<Result<void>>
  findByStartDate(userId: Id, startDate: Date): Promise<Result<Optional<Cycle>>>
}

export const CycleRepositoryProvider = 'CycleRepository'
