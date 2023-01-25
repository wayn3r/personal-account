import { CycleRepository, CycleRepositoryProvider } from '@/cycles/domain'
import { BadRequest, DomainError, Id, NotFound, Optional, Result } from '@/shared/domain/entities'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

const UTC_DATE_REGEX =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{2,6})Z$/
export class CloseCycleCommand {
  private constructor(public readonly id: Id, public readonly endDate: Date) {}

  static create(
    id: Optional<string>,
    endDate: Optional<string>,
  ): Result<CloseCycleCommand> {
    const idResult = Id.fromNullable(
      id,
      () => new BadRequest(DomainError.of('CYCLE_ID_REQUIRED')),
      () => new BadRequest(DomainError.of('INVALID_CYCLE_ID')),
    )

    const endDateResult = endDate
      .validateIsPresent(() => new BadRequest(DomainError.of('END_DATE_REQUIRED')))
      .validate(
        (value) => UTC_DATE_REGEX.test(value),
        () => new BadRequest(DomainError.of('INVALID_END_DATE')),
      )
      .map((value) => new Date(value))

    return Result.combine(idResult, endDateResult).map(
      ([id, endDate]) => new CloseCycleCommand(id, endDate),
    )
  }
}

@CommandHandler(CloseCycleCommand)
export class CloseCycleCommandHandler
  implements ICommandHandler<CloseCycleCommand, Result<void>>
{
  constructor(
    @Inject(CycleRepositoryProvider)
    private readonly cycleRepository: CycleRepository,
  ) {}

  async execute(command: CloseCycleCommand): Promise<Result<void>> {
    const { id, endDate } = command

    const cycleResult = (await this.cycleRepository.findById(id)).flatMap((optional) =>
      optional.validateIsPresent(() => new NotFound(DomainError.of('CYCLE_NOT_FOUND'))),
    )
    if (cycleResult.isFailure()) return cycleResult

    const cycle = cycleResult.getOrThrow()

    const result = cycle.closeCycle(endDate)
    if (result.isFailure()) return result

    return this.cycleRepository.update(cycle)
  }
}
