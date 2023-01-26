import { Id, Optional, Result } from '@/shared/domain/entities'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { TagIdEmpty, TagIdInvalid, TagRepository, TagRepositoryProvider } from '@/transactions/domain'

export class RemoveTagCommand implements ICommand {
  private constructor(public readonly userId: Id, public readonly id: Id) {}

  static create(params: { userId: Id; id: Optional<string> }): Result<RemoveTagCommand> {
    const { userId, id } = params
    return Id.fromNullable(
      id,
      () => new TagIdEmpty(),
      (value) => new TagIdInvalid(String(value)),
    ).map((id) => new RemoveTagCommand(userId, id))
  }
}

@CommandHandler(RemoveTagCommand)
export class RemoveTagCommandHandler implements ICommandHandler<RemoveTagCommand, void> {
  constructor(
    @Inject(TagRepositoryProvider)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(command: RemoveTagCommand): Promise<void> {
    const { userId, id } = command
    await this.tagRepository.removeTag(userId, id)
  }
}
