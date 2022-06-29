import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator'

export class RegisterTransactionDto {
  @IsNotEmpty({ message: 'Transaction must have a name' })
  @IsString({ message: 'Transaction name must be a string' })
  @MinLength(3, { message: 'Transaction name must be at least 3 characters' })
  name: string

  @IsNotEmpty({ message: 'Transaction must have an amount' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Transaction amount must be a number' })
  amount: number

  @IsNotEmpty({ message: 'Transaction must have a currency' })
  @IsString({ message: 'Transaction currency must be a string' })
  @Length(3, 3, { message: 'Transaction currency must be 3 characters' })
  currency: string

  @IsNotEmpty()
  @IsString({ message: 'Transaction type must be a string' })
  type: string

  @IsNotEmpty({ message: 'Transaction must have a money state' })
  @IsString({ message: 'Transaction money state must be a string' })
  moneyState: string

  @IsOptional()
  @IsBoolean()
  isCredit?: boolean

  @IsOptional()
  @IsString({ message: 'Transaction description must be a string' })
  description?: string

  @IsOptional()
  @IsDate({ message: 'Transaction date must be a string' })
  date?: Date

  @IsOptional()
  @IsArray({ message: 'Transaction tags must be an array of string', each: true })
  tags?: string[]
}
