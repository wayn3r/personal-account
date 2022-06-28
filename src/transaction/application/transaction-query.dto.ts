import { IsArray, IsOptional, IsString, Min, MinLength } from 'class-validator'
import { PaginationQuery } from 'shared/pagination-query'

export class TransactionQueryDto extends PaginationQuery {
    @IsOptional()
    @IsString()
    @MinLength(3)
    name?: string

    @IsString()
    @MinLength(3)
    @IsOptional()
    description?: string

    @IsOptional()
    @IsArray()
    @Min(0)
    tags?: string[]

    @IsString()
    @IsOptional()
    @MinLength(3)
    type?: string
}
