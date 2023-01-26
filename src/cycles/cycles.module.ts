import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'
import { Cycle, CycleRepositoryProvider } from './domain'
import { MongoCycleSchema, MongoCycleRepository, CycleControllers, CycleMappers } from './infrastructure'
import { CycleCommandHandlers } from './application'

@Module({
  imports: [CqrsModule, MongooseModule.forFeature([{ name: Cycle.name, schema: MongoCycleSchema }])],
  controllers: [...CycleControllers],
  providers: [
    ...CycleMappers,
    ...CycleCommandHandlers,
    { provide: CycleRepositoryProvider, useClass: MongoCycleRepository },
  ],
})
export class CyclesModule {}
