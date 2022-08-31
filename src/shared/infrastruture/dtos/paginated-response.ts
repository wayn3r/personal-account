import { PaginationQuery } from './pagination-query'

export class PaginatedResponse<T> {
  public readonly page: number
  public readonly totalPages: number
  public readonly count: number
  public readonly totalCount: number
  public readonly querySize: number
  public readonly data: T[]

  constructor(params: { total: number; data: T[]; pagination: PaginationQuery }) {
    this.page = params.pagination.page
    this.totalPages = Math.ceil(params.total / params.pagination.limit)
    this.count = params.data.length
    this.totalCount = params.total
    this.querySize = params.pagination.limit
    this.data = params.data
  }
}
