// logger.ts
import winston from 'winston'
import path from 'path'
import fs from 'fs'
import morgan from 'morgan'

const isProd = process.env.NODE_ENV === 'production'

// Tạo thư mục logs nếu là production
const logDir = path.resolve('logs')
if (isProd && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

// === Winston Logger chính (hệ thống) ===
const transports: winston.transport[] = [new winston.transports.Console()]

if (isProd) {
  transports.push(
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  )
}

const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.label({ label: 'app' }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      ({ level, message, timestamp, label }) => `[${timestamp}] [${label}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports
})

// === Logger riêng cho HTTP ===
const httpLogger = winston.createLogger({
  level: 'http',
  format: winston.format.combine(
    winston.format.label({ label: 'http' }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      ({ level, message, timestamp, label }) => `[${timestamp}] [${label}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: isProd
    ? [new winston.transports.File({ filename: path.join(logDir, 'http.log') })]
    : [new winston.transports.Console()]
})

// === Middleware Morgan log HTTP vào httpLogger ===
const stream = {
  write: (message: string) => {
    httpLogger.http(message.trim())
  }
}

export const morganMiddleware = morgan(':method :url :status :response-time ms - :res[content-length]', { stream })

// === Tạo logger theo từng file (label là tên file) ===
export const getLogger = (filename: string) => {
  return logger.child({
    label: path.basename(filename, path.extname(filename))
  })
}

export default logger
