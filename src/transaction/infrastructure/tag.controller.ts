import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetTags } from 'transaction/application/queries'
import { CreateTagCommand, RemoveTagCommand } from 'transaction/application/commands'
import { Tag } from 'transaction/domain/tag'
import { CreateTagDto } from './dtos/create-tag.dto'

@Controller('tags')
export class TagController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  public async findAll(): Promise<Tag[]> {
    const result = await this.queryBus.execute<GetTags, Tag[]>(new GetTags())

    return result
  }

  @Post('create')
  public async create(@Body() tag: CreateTagDto): Promise<void> {
    await this.commandBus.execute<CreateTagCommand, void>(new CreateTagCommand(tag.name))
  }

  @Delete('remove/:id')
  public async remove(@Param() id: string): Promise<void> {
    await this.commandBus.execute<RemoveTagCommand, void>(new RemoveTagCommand(id))
  }
}
