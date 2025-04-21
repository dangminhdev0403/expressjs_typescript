import fs from 'fs'
import morgan from 'morgan'
import path from 'path'
import winston from 'winston'
import { fileURLToPath } from 'url'

const isProd = process.env.NODE_ENV === 'production'

const logDir = path.resolve('logs')
if (isProd && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

const sensitiveFields = ['password', 'token', 'access_token', 'refresh_token']

function maskSensitiveFields(obj: any): any {
  if (!isProd) return obj
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (sensitiveFields.includes(key)) return '***'
      return value
    })
  )
}

const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, label = 'app' }) => {
    const masked = typeof message === 'object' ? JSON.stringify(maskSensitiveFields(message), null, 2) : String(message)

    return `[${timestamp}] [${label}] ${level.toUpperCase()}: ${masked}`
  })
)

const baseTransports: winston.transport[] = [new winston.transports.Console()]

if (isProd) {
  baseTransports.push(
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
  defaultMeta: { label: 'app' },
  format: baseFormat,
  transports: baseTransports
})

const httpLogger = winston.createLogger({
  level: 'http',
  defaultMeta: { label: 'http' },
  format: baseFormat,
  transports: isProd
    ? [new winston.transports.File({ filename: path.join(logDir, 'http.log') })]
    : [new winston.transports.Console()]
})

const stream = {
  write: (message: string) => {
    httpLogger.http(message.trim())
  }
}

export const morganMiddleware = morgan(':method :url :status :response-time ms - :res[content-length]', { stream })

// Hàm tạo logger theo module (dùng cho ES Modules)
export const getLoggerForModule = (url: string) => {
  const __filename = fileURLToPath(url)
  const label = path.basename(__filename, path.extname(__filename))
  return logger.child({ label })
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM. Shutting down...')
  process.exit(0)
})

export default logger
