import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator'
import { RegisterTransaction } from 'transaction/domain/register-transaction'

export class RegisterTransactionDto implements RegisterTransaction {
  @IsNotEmpty({ message: 'Transaction must have a name' })
  @IsString({ message: 'Transaction name must be a string' })
  @MinLength(3, { message: 'Transaction name must be at least 3 characters' })
  name: string

  @IsNotEmpty({ message: 'Transaction must have an amount' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Transaction amount must be a valid number' },
  )
  amount: number

  @IsNotEmpty({ message: 'Transaction must have a currency' })
  @IsString({ message: 'Transaction currency must be a string' })
  @Length(3, 3, { message: 'Transaction currency must be 3 characters' })
  currency: string

  @IsNotEmpty({ message: 'Transaction must have a type' })
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
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Transaction date must be a timestamp' })
  date?: number

  @IsOptional()
  @IsArray({ message: 'Transaction tags must be an array' })
  @IsNotEmpty({ message: 'A transaction tag must not be an empty string', each: true })
  @IsMongoId({ message: 'Each transaction tag must be a valid id', each: true })
  @ArrayMinSize(1, { message: 'Transaction tags must have at least 1 tag' })
  tags?: string[]
}
