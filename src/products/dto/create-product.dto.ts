import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator'

import { Gender } from 'src/genders/entities/gender.entity'
import { Size } from 'src/sizes/entities/size.entity'
import { Tag } from 'src/tags/entities/tag.entity'

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string

  @IsNumber()
  @IsPositive()
  price: number

  @IsString()
  @MinLength(1)
  description: string

  @IsString()
  @MinLength(1)
  slug: string

  @IsInt()
  @IsPositive()
  stock: number

  @IsNumber()
  @IsPositive()
  gender: Gender

  @IsArray()
  @IsOptional()
  sizes?: Size[]

  @IsArray()
  @IsOptional()
  tags?: Tag[]

  @IsString({ each: true })
  @IsArray()
  images: string[]

  @IsBoolean()
  @IsOptional()
  status?: boolean
}
