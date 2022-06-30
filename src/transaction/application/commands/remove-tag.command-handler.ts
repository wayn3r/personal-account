import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { TagRepository } from 'transaction/domain/tag.repository'

export class RemoveTagCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(RemoveTagCommand)
export class RemoveTagCommandHandler implements ICommandHandler<RemoveTagCommand, void> {
  constructor(
    @Inject(InjectionConfig.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(command: RemoveTagCommand): Promise<void> {
    await this.tagRepository.removeTag(command.id)
  }
}
