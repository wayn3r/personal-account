import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { Optional, Result } from '@/shared/domain/entities'
import { ErrorResponse, HttpController } from '@/shared/infrastruture'
import { SigninCommand } from '@/auth/application'

@Controller('auth/signin')
export class UserSigninController extends HttpController {
  @Post()
  public async signin(
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<Response<ErrorResponse | void>> {
    const optionalBody = Optional.of(body)

    const commandResult = SigninCommand.create({
      token: optionalBody.getFromObject('token'),
    })
    if (commandResult.isFailure()) return this.handleError(res, commandResult)

    const result = await this.commandBus.execute<SigninCommand, Result>(commandResult.getOrThrow())
    if (result.isFailure()) return this.handleError(res, result)

    this.logger.log('User signed in successfully')
    return this.noContent(res)
  }
}
