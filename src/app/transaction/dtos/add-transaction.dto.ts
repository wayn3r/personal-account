import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    MinLength,
} from 'class-validator'

export class AddTransactionDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    credit: number

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    debit: number

    @IsDateString()
    date: string
}
