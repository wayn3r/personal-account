import { CloseCycleController } from './close-cycle.controller'
import { CreateCycleController } from './create-cycle.controller'

export * from './create-cycle.controller'
export * from './close-cycle.controller'

export const CycleControllers = [CreateCycleController, CloseCycleController]
