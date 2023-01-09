import { Cycle, CycleRepository, CycleRepositoryProvider } from '@/cycles/domain'
import { BadRequest, DomainError, Optional, Result } from '@/shared/domain'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/
const UTC_DATE_REGEX =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{2,6})Z$/
export class CreateCycleCommand {
  private constructor(public readonly userId: string, public readonly startDate: Date) {}

  static create(
    userId: Optional<string>,
    startDate: Optional<string>,
  ): Result<CreateCycleCommand> {
    const userIdResult = userId
      .validateIsPresent(() => new BadRequest(DomainError.of('USER_ID_REQUIRED')))
      .validate(
        (value) => OBJECT_ID_REGEX.test(value),
        () => new BadRequest(DomainError.of('INVALID_USER_ID')),
      )

    const startDateResult = startDate
      .validateIsPresent(() => new BadRequest(DomainError.of('START_DATE_REQUIRED')))
      .validate(
        (value) => UTC_DATE_REGEX.test(value),
        () => new BadRequest(DomainError.of('INVALID_START_DATE')),
      )
      .map((value) => new Date(value))

    return Result.combine(userIdResult, startDateResult).map(
      ([userId, startDate]) => new CreateCycleCommand(userId, startDate),
    )
  }
}

@CommandHandler(CreateCycleCommand)
export class CreateCycleCommandHandler
  implements ICommandHandler<CreateCycleCommand, Result<void>>
{
  constructor(
    @Inject(CycleRepositoryProvider)
    private readonly cycleRepository: CycleRepository,
  ) {}

  async execute(command: CreateCycleCommand): Promise<Result<void>> {
    const { userId, startDate } = command

    const cycleResult = Cycle.create(userId, startDate)
    if (cycleResult.isFailure()) return cycleResult

    const cycle = cycleResult.getOrThrow()

    return this.cycleRepository.save(cycle)
  }
}
