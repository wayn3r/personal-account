import { CreateCycleCommand } from '@/cycles/application'
import { Optional, Result } from '@/shared/domain/entities'
import { ErrorResponse, HttpController } from '@/shared/infrastruture'
import { Controller, Post, Body, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller('/cycles')
export class CreateCycleController extends HttpController {
  @Post()
  public async create(
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<Response<ErrorResponse | void>> {
    const optionalBody = Optional.of(body)

    const commandResult = CreateCycleCommand.create(
      optionalBody.getFromObject('name'),
      optionalBody.getFromObject('userId'),
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
