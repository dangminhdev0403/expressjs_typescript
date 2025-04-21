import { getLoggerForModule } from '@config/logger.js'
import morgan from 'morgan'

const logger = getLoggerForModule(import.meta.url)

export const morganMiddleware = morgan('dev', {
  stream: {
    write: (message) => logger.http(message.trim())
  }
})
