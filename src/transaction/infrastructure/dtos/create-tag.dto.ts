import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateTagDto {
  @IsNotEmpty({ message: 'Tag name is required' })
  @MinLength(3, { message: 'Tag name must be at least 3 characters long' })
  @IsString({ message: 'Tag name must be a string' })
  name: string
}
