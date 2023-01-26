import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common'
import { CreateTagCommand, RemoveTagCommand } from '@/transactions/application'
import { Optional, Result, User } from '@/shared/domain'
import { HttpController } from '@/shared/infrastruture'
import { Response } from 'express'
import { GetTags } from '../queries'
import { TagResponse } from '../dtos'
import { AuthGuard, CurrentUser } from '@/auth/infrastructure'

type CreateTagBody = {
  name: string
}

@Controller('tags')
@UseGuards(AuthGuard)
export class TagController extends HttpController {
  @Get()
  public async findAll(@CurrentUser() user: User, @Res() res: Response): Promise<Response> {
    const queryResult = GetTags.create(user.id)
    if (queryResult.isFailure()) return this.handleError(res, queryResult)

    const query = queryResult.getOrThrow()
    const result = await this.queryBus.execute<GetTags, Result<TagResponse[]>>(query)
    if (result.isFailure()) return this.handleError(res, result)

    return this.ok(res, result.getOrThrow())
  }

  @Post('create')
  public async create(@CurrentUser() user: User, @Body() body: CreateTagBody, @Res() res: Response): Promise<Response> {
    const optionalBody = Optional.of(body)
    const commandResult = CreateTagCommand.create({
      userId: user.id,
      name: optionalBody.getFromObject('name'),
    })
    if (commandResult.isFailure()) return this.handleError(res, commandResult)

    const command = commandResult.getOrThrow()
    const result = await this.commandBus.execute<CreateTagCommand, Result>(command)
    if (result.isFailure()) return this.handleError(res, result)

    return this.noContent(res)
  }

  @Delete('remove/:id')
  public async remove(@CurrentUser() user: User, @Param() id: string, @Res() res: Response): Promise<Response> {
    const commandResult = RemoveTagCommand.create({
      userId: user.id,
      id: Optional.of(id),
    })
    if (commandResult.isFailure()) return this.handleError(res, commandResult)

    const command = commandResult.getOrThrow()
    const result = await this.commandBus.execute<RemoveTagCommand, Result>(command)
    if (result.isFailure()) return this.handleError(res, result)

    return this.noContent(res)
  }
}
