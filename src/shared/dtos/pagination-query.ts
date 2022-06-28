import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator'

export class PaginationQuery {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  page = 0

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  limit = 10

  @IsOptional()
  @IsNumber()
  @IsEnum([1, -1])
  order = -1
}
