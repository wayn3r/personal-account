export interface PaginatedResponse<T> {
  readonly page: number
  readonly totalPages: number
  readonly count: number
  readonly totalCount: number
  readonly querySize: number
  readonly content: T[]
}
