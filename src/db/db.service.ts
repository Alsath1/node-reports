import { PrismaClient } from '@prisma/client'

class DatabaseService {
  private static instance: DatabaseService
  public prisma: PrismaClient

  private constructor() {
    this.prisma = new PrismaClient()
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  async connect(): Promise<void> {
    await this.prisma.$connect()
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }
}

export const dbService = DatabaseService.getInstance()
