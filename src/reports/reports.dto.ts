import { Status } from '@prisma/client'
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class ReportsCreateDto {
  @IsString()
  title: string = ''

  @IsString()
  description: string = ''

  @IsEnum(Status)
  @IsOptional()
  status?: Status
}

export class ReportsGetDto {
  @IsNumber()
  id: number = NaN
}
export class ReportsProcessDto {
  @IsNumber()
  id: number = NaN

  @IsString()
  @IsOptional()
  message?: string = ''

  @IsEnum(Status)
  status: Status = 'New'
}

export class ReportsFilterDto {
  @IsOptional()
  @IsDateString()
  date?: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string
}
