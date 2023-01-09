import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { CreateTagCommand, RemoveTagCommand } from '@/transactions/application'
import { Result } from 'shared/domain/result'
import { Optional } from '@/shared/domain'
import { HttpController } from '@/shared/infrastruture'
import { Response } from 'express'
import { Res } from '@nestjs/common/decorators'
import { GetTags } from '../queries'
import { TagResponse } from '../dtos'

@Controller('tags')
export class TagController extends HttpController {
  @Get()
  public async findAll(@Res() res: Response): Promise<Response> {
    const query = new GetTags()
    const result = await this.queryBus.execute<GetTags, Result<TagResponse[]>>(query)
    if (result.isFailure()) return this.handleError(res, result)

    return this.ok(res, result.getOrThrow())
  }

  @Post('create')
  public async create(
    @Res() res: Response,
    @Body() body: { name: string },
  ): Promise<Response> {
    const optionalBody = Optional.of(body)
    const commandResult = CreateTagCommand.create(optionalBody.getFromObject('name'))
    if (commandResult.isFailure()) return this.handleError(res, commandResult)

    const command = commandResult.getOrThrow()
    const result = await this.commandBus.execute<CreateTagCommand, Result>(command)
    if (result.isFailure()) return this.handleError(res, result)

    return this.noContent(res)
  }

  @Delete('remove/:id')
  public async remove(@Res() res: Response, @Param() id: string): Promise<Response> {
    const commandResult = RemoveTagCommand.create(Optional.of(id))
    if (commandResult.isFailure()) return this.handleError(res, commandResult)

    const command = commandResult.getOrThrow()
    const result = await this.commandBus.execute<RemoveTagCommand, Result>(command)
    if (result.isFailure()) return this.handleError(res, result)

    return this.noContent(res)
  }
}
