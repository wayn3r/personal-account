import { Optional } from '@/shared/domain/entities'

export const DEFAULT_PAGINATION_CONFIG = {
  minPage: 1,
  maxPage: Infinity,
  minLimit: 1,
  maxLimit: 100,
  defaultLimit: 10,
  defaultPage: 1,
}

export class PaginationQuery {
  private constructor(public readonly page: number, public readonly limit: number) {}

  static create(page: Optional<number>, limit: Optional<number>): PaginationQuery {
    const isNumber = (value: any) => !isNaN(value)
    const { minPage, maxPage, defaultPage, maxLimit, minLimit, defaultLimit } = DEFAULT_PAGINATION_CONFIG

    const pageResult = page
      .filter((page) => isNumber(page))
      .map((page) => Number(page))
      .map((page) => Math.max(page, minPage))
      .map((page) => Math.min(page, maxPage))
      .orElse(defaultPage)
    const limitResult = limit
      .filter((limit) => isNumber(limit))
      .map((limit) => Number(limit))
      .map((limit) => Math.max(limit, minLimit))
      .map((limit) => Math.min(limit, maxLimit))
      .orElse(defaultLimit)

    return new PaginationQuery(pageResult, limitResult)
  }

  skip() {
    const multiplier = this.page <= 1 ? 0 : this.page - 1
    return multiplier * this.limit
  }
}
