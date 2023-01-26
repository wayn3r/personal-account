import { Optional, Result, User } from '@/shared/domain'
import { ErrorResponse, HttpController, PaginatedResponse, PaginationQuery } from '@/shared/infrastruture'
import { Query, Controller, Get, Res, UseGuards, Param } from '@nestjs/common'
import { Response } from 'express'
import { TransactionResponse } from '../dtos'
import { GetTransactionQuery, GetTransactionsQuery } from '../queries'
import { AuthGuard, CurrentUser } from '@/auth/infrastructure'

@Controller('transactions')
@UseGuards(AuthGuard)
export class GetTransactionsController extends HttpController {
  @Get()
  public async find(
    @CurrentUser() user: User,
    @Query() query: Record<string, any>,
    @Res() res: Response,
  ): Promise<Response<ErrorResponse | PaginatedResponse<TransactionResponse>>> {
    const params = Optional.of(query)
    const pagination = PaginationQuery.create(params.getFromObject('page'), params.getFromObject('limit'))

    const queryResult = GetTransactionsQuery.create(user.id, pagination)
    if (queryResult.isFailure()) return this.handleError(res, queryResult)

    const result = await this.queryBus.execute<GetTransactionsQuery, Result<PaginatedResponse<TransactionResponse>>>(
      queryResult.getOrThrow(),
    )

    if (result.isFailure()) return this.handleError(res, result)

    return this.ok(res, result.getOrThrow())
  }

  @Get(':id')
  public async findOne(
    @CurrentUser() user: User,
    @Param() id: string,
    @Res() res: Response,
  ): Promise<Response<ErrorResponse | TransactionResponse>> {
    const queryResult = GetTransactionQuery.create({
      userId: user.id,
      id: Optional.of(id),
    })
    if (queryResult.isFailure()) return this.handleError(res, queryResult)

    const result = await this.queryBus.execute<GetTransactionQuery, Result<TransactionResponse>>(
      queryResult.getOrThrow(),
    )

    if (result.isFailure()) return this.handleError(res, result)

    return this.ok(res, result.getOrThrow())
  }
}
