import { IsEnum, IsNumber, Min } from 'class-validator'

export class PaginationQuery {
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be greater than 0' })
  page = 1

  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Limit must be a number' })
  @Min(1)
  limit = 10

  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Order must be a number' })
  @IsEnum([1, -1], { message: 'Order must be 1 or -1' })
  order = -1
}
