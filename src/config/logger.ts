import fs from 'fs'
import morgan from 'morgan'
import path from 'path'
import winston, { loggers } from 'winston'

const isProd = process.env.NODE_ENV === 'production'

// Tạo thư mục logs
const logDir = path.resolve('logs')
if (isProd && !fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true })
  } catch (error: unknown) {
    if (error instanceof Error) loggers.close(`Failed to create log directory: ${error.message}`)
    throw error
  }
}

// Winston Logger chính
const transports: winston.transport[] = [new winston.transports.Console()]

if (isProd) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      tailable: true,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      tailable: true,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5
    })
  )
}

const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  defaultMeta: { label: 'app' }, // Đặt label mặc định trong meta
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
    winston.format.printf(({ level, message, timestamp, label }) => {
      // Sử dụng label từ meta hoặc fallback về 'app'
      const logLabel = label || 'app'
      return `[${timestamp}] [${logLabel}] ${level.toUpperCase()}: ${
        typeof message === 'object' && message !== null && !Array.isArray(message) ? JSON.stringify(message) : String(message)
      }`
    })
  ),
  transports
})

// Logger HTTP
const httpLogger = winston.createLogger({
  level: 'http',
  defaultMeta: { label: 'http' },
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, label }) => {
      return `[${timestamp}] [${label}] ${level.toUpperCase()}: ${message}`
    })
  ),
  transports: isProd
    ? [new winston.transports.File({ filename: path.join(logDir, 'http.log') })]
    : [new winston.transports.Console()]
})

// Morgan Middleware
const stream = {
  write: (message: string) => {
    httpLogger.http(message.trim())
  }
}

export const morganMiddleware = morgan(':method :url :status :response-time ms - :res[content-length]', { stream })

// Tạo child logger
export const getLogger = (filename: string) => {
  const label = path.basename(filename, path.extname(filename))
  return logger.child({ label })
}

export default logger

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.end(() => {
    process.exit(0)
  })
})
