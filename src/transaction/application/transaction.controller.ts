import { RemoveTransactionCommand } from './commands/remove-transaction.command-handler'
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { PaginationQuery } from 'shared/infrastruture/dtos/pagination-query'
import { Transaction } from '../domain/transaction'
import { RegisterTransactionCommand } from './commands/register-transaction.command-handler'
import { RegisterTransactionDto } from '../infrastructure/dtos/register-transaction.dto'
import { GetTransactionsQuery } from './queries/get-transactions.query-handler'
import { GetTransactionQuery } from './queries/get-transaction.query-handler'
import { Paginated } from 'shared/infrastruture/decorators/paginated.decorator'

@Controller('transactions')
export class GetTransactionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  public async findAll(
    @Paginated()
    @Query()
    query: PaginationQuery,
  ): Promise<Transaction[]> {
    const result = await this.queryBus.execute<GetTransactionsQuery, Transaction[]>(
      new GetTransactionsQuery(query),
    )

    return result
  }

  @Get(':id')
  public async findOne(@Param() id: string) {
    const result = await this.queryBus.execute<GetTransactionQuery, Transaction>(
      new GetTransactionQuery(id),
    )

    return result
  }

  @Post('register')
  public async register(@Body() transaction: RegisterTransactionDto): Promise<void> {
    await this.commandBus.execute<RegisterTransactionCommand, void>(
      new RegisterTransactionCommand(transaction),
    )
  }

  @Delete('remove/:id')
  public async remove(@Param() id: string): Promise<void> {
    await this.commandBus.execute<RemoveTransactionCommand, void>(
      new RemoveTransactionCommand(id),
    )
  }
}
