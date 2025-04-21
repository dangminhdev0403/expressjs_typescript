// src/errors/AppError.ts

type ErrorDetail<T> = {
  errors?: T | null
  message: string
}
export class AppError<T = ErrorDetail<unknown>[]> extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly errors: T | null

  constructor(message: string, statusCode = 500, isOperational = true, errors?: T) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.errors = errors ?? null // Nếu không có errors, gán null

    Error.captureStackTrace(this, this.constructor)
  }
}
