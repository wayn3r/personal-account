import { Controller, Delete, Param, UseGuards, Res } from '@nestjs/common'
import { RemoveTransactionCommand } from '@/transactions/application'
import { Optional, Result, User } from '@/shared/domain'
import { ErrorResponse, HttpController } from '@/shared/infrastruture'
import { AuthGuard, CurrentUser } from '@/auth/infrastructure'
import { Response } from 'express'

@Controller('transactions')
@UseGuards(AuthGuard)
export class RemoveTransactionController extends HttpController {
  @Delete('remove/:id')
  public async remove(
    @CurrentUser() user: User,
    @Param() id: string,
    @Res() res: Response,
  ): Promise<Response<ErrorResponse | void>> {
    const commandResult = RemoveTransactionCommand.create({
      userId: user.id,
      id: Optional.of(id),
    })
    if (commandResult.isFailure()) return this.handleError(res, commandResult)

    const command = commandResult.getOrThrow()
    const result = await this.commandBus.execute<RemoveTransactionCommand, Result>(command)

    if (result.isFailure()) return this.handleError(res, result)

    return this.noContent(res)
  }
}
