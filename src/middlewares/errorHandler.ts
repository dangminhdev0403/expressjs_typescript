// src/middlewares/errorHandler.ts
import { createResponse } from '@models/response/format.response.js'
import { AppError } from '@utils/error/AppError.js'
import { NextFunction, Request, Response } from 'express'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction // ⬅️ PHẢI có tham số này để Express nhận dạng middleware lỗi
) => {
  if (err instanceof AppError) {
    const errorRes: object = createResponse(err.statusCode, err.message)
    return res.status(err.statusCode).json(errorRes)
  }

  console.error('Unexpected error:', err)

  return res.status(500).json({
    message: 'Internal Server Error'
  })
}
