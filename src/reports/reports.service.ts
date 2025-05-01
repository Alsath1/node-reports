import { dbService } from '../db/db.service'
import {
  ReportsCreateDto,
  ReportsFilterDto,
  ReportsGetDto,
  ReportsProcessDto,
} from './reports.dto'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { Prisma } from '@prisma/client'
export class ReportsService {
  private static prisma = dbService.prisma

  private static async validateDto<T>(
    dtoClass: new () => T,
    data: any
  ): Promise<T> {
    const dto = plainToInstance(dtoClass, data)
    const errors = await validate(dto as object)
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${JSON.stringify(errors)}`)
    }
    return dto
  }

  static async createReport(data: ReportsCreateDto) {
    const validData = await this.validateDto(ReportsCreateDto, data)
    return await this.prisma.report.create({
      data: { title: validData.title, description: validData.description },
    })
  }

  static async getReportById(id: ReportsGetDto) {
    const validData = await this.validateDto(ReportsGetDto, id)
    return await this.prisma.report.findUnique({ where: { id: validData.id } })
  }

  static async applyReportById(id: ReportsGetDto) {
    const validData = await this.validateDto(ReportsGetDto, id)

    return await this.prisma.report.update({
      where: { id: validData.id },
      data: { status: 'Work' },
    })
  }

  static async statusChangeReport(data: ReportsProcessDto) {
    const validData = await this.validateDto(ReportsProcessDto, data)
    if (validData.status === 'Close') {
      return await this.prisma.report.update({
        where: { id: validData.id },
        data: { status: validData.status, closedMessage: validData?.message },
      })
    }
    if (validData.status === 'Resolved') {
      return await this.prisma.report.update({
        where: { id: validData.id },
        data: { status: validData.status, resolvedMessage: validData?.message },
      })
    } else {
      return false
    }
  }

  static async closedAllReports() {
    await this.prisma.report.updateMany({
      where: {
        status: 'Work',
      },
      data: {
        status: 'Close',
      },
    })
  }

  static async filterdateReports(data: ReportsFilterDto) {
    const validData = await this.validateDto(ReportsFilterDto, data)
    const where: Prisma.ReportWhereInput = {}

    if (validData.date) {
      const date = new Date(validData.date)
      const nextDay = new Date(date)
      nextDay.setDate(date.getDate() + 1)

      where.createdAt = {
        gte: date,
        lt: nextDay,
      }
    }

    if (validData.startDate && validData.endDate) {
      where.createdAt = {
        gte: new Date(validData.startDate),
        lte: new Date(validData.endDate),
      }
    } else if (validData.startDate) {
      where.createdAt = {
        gte: new Date(validData.startDate),
      }
    } else if (validData.endDate) {
      where.createdAt = {
        lte: new Date(validData.endDate),
      }
    }

    return this.prisma.report.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
