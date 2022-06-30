import { GetItemsPaginatedQuery } from 'shared/domain/get-items-paginated-query'
import { PaginatedResponse } from 'shared/domain/paginated-response'

export class PaginatedDto<T> implements PaginatedResponse<T> {
  public readonly page: number
  public readonly totalPages: number
  public readonly count: number
  public readonly totalCount: number
  public readonly querySize: number
  public readonly content: T[]

  constructor(params: {
    total: number
    content: T[]
    pagination: GetItemsPaginatedQuery
  }) {
    this.page = params.pagination.page
    this.totalPages = Math.ceil(params.total / params.pagination.limit)
    this.count = params.content.length
    this.totalCount = params.total
    this.querySize = params.pagination.limit
    this.content = params.content
  }
}
