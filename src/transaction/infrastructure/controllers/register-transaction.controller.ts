import { Body, Controller, Post } from '@nestjs/common'
import { Optional, Result } from 'shared/domain'
import { ErrorResponse, HttpController } from 'shared/infrastruture'
import { RegisterTransactionCommand } from 'transaction/application'

@Controller('transactions')
export class RegisterTransactionController extends HttpController {
  @Post('register')
  public async register(
    @Body() body: Record<string, any>,
  ): Promise<ErrorResponse | void> {
    const optionalBody = Optional.of(body)
    const commandResult = RegisterTransactionCommand.create({
      name: optionalBody.getFromObject('name'),
      description: optionalBody.getFromObject('description'),
      amount: optionalBody.getFromObject('amount'),
      account: optionalBody.getFromObject('account'),
      currency: optionalBody.getFromObject('currency'),
      type: optionalBody.getFromObject('type'),
      date: optionalBody.getFromObject('date'),
      tags: optionalBody.getFromObject('tags'),
    })

    if (commandResult.isFailure()) return this.handleError(commandResult)
    const result = await this.commandBus.execute<RegisterTransactionCommand, Result>(
      commandResult.getOrThrow(),
    )

    if (result.isFailure()) return this.handleError(result)

    this.logger.log('Transaction registered successfully')
    return this.noContent()
  }
}
