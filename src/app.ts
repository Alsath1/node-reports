import express, { Request, Response } from 'express'

import { dbService } from './db/db.service'
import { ReportsService } from './reports/reports.service'
import { ReportsGetDto } from './reports/reports.dto'

const app = express()
const PORT = 3000

app.use(express.json())

app.post('/create', async (req, res) => {
  try {
    const createdReport = await ReportsService.createReport(req.body)
    res.status(201).json(createdReport)
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Validation failed',
    })
  }
})

app.get('/get-report/:id', async (req: Request, res: Response) => {
  const dto: ReportsGetDto = {
    id: Number(req.params.id),
  }
  try {
    const getReport = await ReportsService.getReportById(dto)
    if (!getReport) {
      res.status(404).json({ error: 'Report not found' })
    }
    res.status(200).json(getReport)
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Validation failed',
    })
  }
})

app.put('/:id/take-in-work', async (req: Request, res: Response) => {
  const dto: ReportsGetDto = {
    id: Number(req.params.id),
  }
  try {
    const getReport = await ReportsService.applyReportById(dto)
    if (!getReport) {
      res.status(404).json({ error: 'Report not found' })
    }
    res.status(200).json(getReport)
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Validation failed',
    })
  }
})

app.post('/status-change', async (req: Request, res: Response) => {
  try {
    const change = await ReportsService.statusChangeReport(req.body)
    if (!change) {
      res.status(400).json({ error: 'Status must be Close or Resolved' })
    } else {
      res.status(200).json(change)
    }
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Validation failed',
    })
  }
})

app.put('/close-all-reports', async (req: Request, res: Response) => {
  try {
    await ReportsService.closedAllReports()
    res.status(200).json('all reports were closed successfully')
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Validation failed',
    })
  }
})

app.get('/get-date-reports', async (req: Request, res: Response) => {
  try {
    const reports = await ReportsService.filterdateReports(req.query)
    res.status(200).json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    res.status(500).json({
      error: 'Failed to get reports',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

app.listen(PORT, async () => {
  await dbService.connect()
  console.log(`Server running on port ${PORT}`)
})

process.on('SIGINT', async () => {
  await dbService.disconnect()
  process.exit()
})
