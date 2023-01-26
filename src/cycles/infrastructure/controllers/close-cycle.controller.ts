import { AuthGuard, CurrentUser } from '@/auth/infrastructure'
import { CloseCycleCommand } from '@/cycles/application'
import { Optional, Result, User } from '@/shared/domain'
import { ErrorResponse, HttpController } from '@/shared/infrastruture'
import { Controller, Body, Res, Delete, UseGuards } from '@nestjs/common'
import { Response } from 'express'

@Controller('/cycles')
@UseGuards(AuthGuard)
export class CloseCycleController extends HttpController {
  @Delete()
  public async create(
    @CurrentUser() user: User,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<Response<ErrorResponse | void>> {
    const optionalBody = Optional.of(body)

    const commandResult = CloseCycleCommand.create(
      user.id,
      optionalBody.getFromObject('id'),
      optionalBody.getFromObject('endDate'),
    )
    if (commandResult.isFailure()) return this.handleError(res, commandResult)

    const result = await this.commandBus.execute<CloseCycleCommand, Result>(commandResult.getOrThrow())
    if (result.isFailure()) return this.handleError(res, result)

    this.logger.log('Cycle closed successfully')
    return this.noContent(res)
  }
}
