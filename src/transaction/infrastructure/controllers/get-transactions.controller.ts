import { Optional, Result } from '@/shared/domain'
import {
  ErrorResponse,
  HttpController,
  PaginatedResponse,
  PaginationQuery,
} from '@/shared/infrastruture'
import { Query, Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'
import { TransactionResponse } from '../dtos'
import { GetTransactionsQuery } from '../queries'

@Controller('transactions')
export class GetTransactionsController extends HttpController {
  @Get()
  public async find(
    @Query() query: Record<string, any>,
    @Res() res: Response,
  ): Promise<Response<ErrorResponse | PaginatedResponse<TransactionResponse>>> {
    const params = Optional.of(query)
    const pagination = PaginationQuery.create(
      params.getFromObject('page'),
      params.getFromObject('limit'),
    )

    const queryResult = GetTransactionsQuery.create(pagination)
    if (queryResult.isFailure()) return this.handleError(res, queryResult)

    const result = await this.queryBus.execute<
      GetTransactionsQuery,
      Result<PaginatedResponse<TransactionResponse>>
    >(queryResult.getOrThrow())

    if (result.isFailure()) return this.handleError(res, result)

    return this.ok(res, result.getOrThrow())
  }
}
