import { Result } from '@/shared/domain'
import { Cycle } from '../entities'

export interface CycleRepository {
  save(cycle: Cycle): Promise<Result<void>>
}

export const CycleRepositoryProvider = 'CycleRepository'
