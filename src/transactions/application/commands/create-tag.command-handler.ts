import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { Optional, Result } from 'shared/domain'
import { Tag, TagRepository, TagRepositoryProvider } from '@/transactions/domain'

export class CreateTagCommand implements ICommand {
  private constructor(public readonly tag: Tag) {}

  static create(name: Optional<string>): Result<CreateTagCommand> {
    return Tag.create({ name }).map((tag) => new CreateTagCommand(tag))
  }
}

@CommandHandler(CreateTagCommand)
export class CreateTagCommandHandler
  implements ICommandHandler<CreateTagCommand, Result>
{
  constructor(
    @Inject(TagRepositoryProvider)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(command: CreateTagCommand): Promise<Result> {
    const { tag } = command
    return await this.tagRepository.createOne(tag)
  }
}
