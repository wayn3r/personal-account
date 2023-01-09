import { Id, Optional, Result } from '@/shared/domain'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import {
  TagIdEmpty,
  TagIdInvalid,
  TagRepository,
  TagRepositoryProvider,
} from '@/transactions/domain'

export class RemoveTagCommand implements ICommand {
  private constructor(public readonly id: Id) {}

  static create(id: Optional<string>): Result<RemoveTagCommand> {
    return Id.fromNullable(
      id,
      () => new TagIdEmpty(),
      (value) => new TagIdInvalid(String(value)),
    ).map((id) => new RemoveTagCommand(id))
  }
}

@CommandHandler(RemoveTagCommand)
export class RemoveTagCommandHandler implements ICommandHandler<RemoveTagCommand, void> {
  constructor(
    @Inject(TagRepositoryProvider)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(command: RemoveTagCommand): Promise<void> {
    await this.tagRepository.removeTag(command.id)
  }
}
