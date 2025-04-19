import { getLogger } from '@config/logger.js'
import morgan from 'morgan'

const logger = getLogger('morgan')

export const morganMiddleware = morgan('dev', {
  stream: {
    write: (message) => logger.http(message.trim())
  }
})
