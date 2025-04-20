// loggerFactory.ts (hoặc loggerFactory.js nếu bạn dùng JS)
import { fileURLToPath } from 'url'
import path from 'path'
import { getLogger as createLogger } from './logger.js'

export const logger = createLogger(getCallerFilename())

// Helper lấy đường dẫn file gọi `logger`
function getCallerFilename(): string {
  const originalFunc = Error.prepareStackTrace

  let callerFile: string | undefined
  try {
    const err = new Error()
    Error.prepareStackTrace = (_, stack) => stack

    const currentfile = (err.stack as any)[1].getFileName()
    for (let i = 2; i < (err.stack as any).length; i++) {
      const file = (err.stack as any)[i].getFileName()
      if (file !== currentfile) {
        callerFile = file
        break
      }
    }
  } catch (e) {
    console.error(e)}

  Error.prepareStackTrace = originalFunc
  return callerFile || 'unknown'
}
