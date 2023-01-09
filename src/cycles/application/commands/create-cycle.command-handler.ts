import { Cycle, CycleRepository, CycleRepositoryProvider } from '@/cycles/domain'
import { BadRequest, Conflict, DomainError, Id, Optional, Result } from '@/shared/domain'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

const UTC_DATE_REGEX =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{2,6})Z$/
export class CreateCycleCommand {
  private constructor(
    public readonly name: string,
    public readonly userId: Id,
    public readonly startDate: Date,
  ) {}

  static create(
    name: Optional<string>,
    userId: Optional<string>,
    startDate: Optional<string>,
  ): Result<CreateCycleCommand> {
    const nameResult = name
      .validateIsPresent(() => new BadRequest(DomainError.of('NAME_REQUIRED')))
      .validate(
        (value) => typeof value === 'string',
        () => new BadRequest(DomainError.of('INVALID_NAME')),
      )
      .map((value) => value.trim())
      .validate(
        (value) => value.length >= 3,
        () => new BadRequest(DomainError.of('NAME_TOO_SHORT')),
      )
      .validate(
        (value) => value.length <= 24,
        () => new BadRequest(DomainError.of('NAME_TOO_LONG')),
      )

    const userIdResult = Id.fromNullable(
      userId,
      () => new BadRequest(DomainError.of('USER_ID_REQUIRED')),
      () => new BadRequest(DomainError.of('INVALID_USER_ID')),
    )

    const startDateResult = startDate
      .validateIsPresent(() => new BadRequest(DomainError.of('START_DATE_REQUIRED')))
      .validate(
        (value) => UTC_DATE_REGEX.test(value),
        () => new BadRequest(DomainError.of('INVALID_START_DATE')),
      )
      .map((value) => new Date(value))

    return Result.combine(nameResult, userIdResult, startDateResult).map(
      ([name, userId, startDate]) => new CreateCycleCommand(name, userId, startDate),
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
    const { name, userId, startDate } = command

    const cycleResult = (await this.cycleRepository.findByStartDate(userId, startDate))
      .validate(
        (optional) => optional.isAbsent(),
        () => new Conflict(DomainError.of('CYCLE_ALREADY_EXISTS')),
      )
      .flatMap(() => Cycle.create(name, userId, startDate))
    if (cycleResult.isFailure()) return cycleResult

    const cycle = cycleResult.getOrThrow()

    return this.cycleRepository.save(cycle)
  }
}
