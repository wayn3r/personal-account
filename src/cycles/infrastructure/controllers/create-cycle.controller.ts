import { AuthGuard, CurrentUser } from '@/auth/infrastructure'
import { CreateCycleCommand } from '@/cycles/application'
import { Optional, Result, User } from '@/shared/domain'
import { ErrorResponse, HttpController } from '@/shared/infrastruture'
import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'

type CreateCycleBody = {
  name: string
  startDate: string
}
@Controller('/cycles')
@UseGuards(AuthGuard)
export class CreateCycleController extends HttpController {
  @Post()
  public async create(
    @CurrentUser() user: User,
    @Body() body: CreateCycleBody,
    @Res() res: Response,
  ): Promise<Response<ErrorResponse | void>> {
    const optionalBody = Optional.of(body)

    const commandResult = CreateCycleCommand.create(
      user.id,
      optionalBody.getFromObject('name'),
      optionalBody.getFromObject('startDate'),
    )
    if (commandResult.isFailure()) return this.handleError(res, commandResult)

    const result = await this.commandBus.execute<CreateCycleCommand, Result>(
      commandResult.getOrThrow(),
    )
    if (result.isFailure()) return this.handleError(res, result)

    this.logger.log('Cycle created successfully')
    return this.noContent(res)
  }
}
