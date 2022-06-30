import { Inject } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { InjectionConfig } from 'injection-config'
import { TagRepository } from 'transaction/domain/tag.repository'

export class CreateTagCommand implements ICommand {
  constructor(public readonly name: string) {}
}

@CommandHandler(CreateTagCommand)
export class CreateTagCommandHandler implements ICommandHandler<CreateTagCommand, void> {
  constructor(
    @Inject(InjectionConfig.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(command: CreateTagCommand): Promise<void> {
    await this.tagRepository.createOne(command.name)
  }
}
