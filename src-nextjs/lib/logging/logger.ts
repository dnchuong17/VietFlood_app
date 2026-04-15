/**
 * Centralized logging utility for VietFlood
 * Provides structured logging with levels, categories, and exports
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  category: string
  message: string
  data?: Record<string, any>
  stack?: string
}

class Logger {
  private logs: LogEntry[] = []
  private readonly maxLogs = 500
  private minLevel = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO

  private createEntry(
    level: LogLevel,
    category: string,
    message: string,
    data?: Record<string, any>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data
    }
  }

  private formatLog(entry: LogEntry): string {
    const levelName = Object.keys(LogLevel)[entry.level].toUpperCase()
    return `[${entry.timestamp}] [${entry.category}] [${levelName}] ${entry.message}`
  }

  debug(category: string, message: string, data?: Record<string, any>) {
    if (this.minLevel <= LogLevel.DEBUG) {
      const entry = this.createEntry(LogLevel.DEBUG, category, message, data)
      console.debug(this.formatLog(entry), data)
      this.store(entry)
    }
  }

  info(category: string, message: string, data?: Record<string, any>) {
    if (this.minLevel <= LogLevel.INFO) {
      const entry = this.createEntry(LogLevel.INFO, category, message, data)
      console.log(this.formatLog(entry), data)
      this.store(entry)
    }
  }

  warn(category: string, message: string, data?: Record<string, any>) {
    if (this.minLevel <= LogLevel.WARN) {
      const entry = this.createEntry(LogLevel.WARN, category, message, data)
      console.warn(this.formatLog(entry), data)
      this.store(entry)
    }
  }

  error(category: string, message: string, error?: Error | null, data?: Record<string, any>) {
    const entry = this.createEntry(LogLevel.ERROR, category, message, data)
    if (error?.stack) {
      entry.stack = error.stack
    }
    console.error(this.formatLog(entry), error, data)
    this.store(entry)
  }

  private store(entry: LogEntry) {
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
  }

  getAllLogs(): LogEntry[] {
    return [...this.logs]
  }

  getLogs(category?: string, level?: LogLevel): LogEntry[] {
    return this.logs.filter(log => {
      if (category && log.category !== category) return false
      if (level !== undefined && log.level < level) return false
      return true
    })
  }

  clear() {
    this.logs = []
  }

  exportAsJSON(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const logger = new Logger()
