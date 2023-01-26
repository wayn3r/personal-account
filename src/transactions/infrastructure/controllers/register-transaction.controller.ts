import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { Optional, Result, User } from '@/shared/domain'
import { ErrorResponse, HttpController } from '@/shared/infrastruture'
import { RegisterTransactionCommand } from '@/transactions/application'
import { AuthGuard, CurrentUser } from '@/auth/infrastructure'

@Controller('transactions/register')
@UseGuards(AuthGuard)
export class RegisterTransactionController extends HttpController {
  @Post()
  public async register(
    @CurrentUser() user: User,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<Response<ErrorResponse | void>> {
    const optionalBody = Optional.of(body)

    const commandResult = RegisterTransactionCommand.create({
      userId: user.id,
      name: optionalBody.getFromObject('name'),
      description: optionalBody.getFromObject('description'),
      amount: optionalBody.getFromObject('amount'),
      account: optionalBody.getFromObject('account'),
      currency: optionalBody.getFromObject('currency'),
      type: optionalBody.getFromObject('type'),
      date: optionalBody.getFromObject('date'),
      tags: optionalBody.getFromObject('tags'),
    })
    if (commandResult.isFailure()) return this.handleError(res, commandResult)

    const result = await this.commandBus.execute<RegisterTransactionCommand, Result>(commandResult.getOrThrow())
    if (result.isFailure()) return this.handleError(res, result)

    this.logger.log('Transaction registered successfully')
    return this.noContent(res)
  }
}
