// src/middlewares/errorHandler.ts

import { createResponse } from '@models/response/format.response.js'
import { AppError } from '@utils/error/AppError.js'
import { NextFunction, Request, Response } from 'express'

/**
 * Middleware xử lý lỗi tập trung trong toàn hệ thống.
 * Phải có đủ 4 tham số (err, req, res, next) thì Express mới nhận dạng là middleware lỗi.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction // ⬅️ PHẢI có để Express nhận ra đây là error-handling middleware
) => {
  // Nếu là lỗi có chủ đích được tạo ra bằng AppError
  if (err instanceof AppError) {
    const errorRes = createResponse(
      err.statusCode,
      err.message,
      null,
      err.errors ?? err.message // chứa chi tiết lỗi nếu có (vd: mảng lỗi validate)
    )

    return res.status(err.statusCode).json(errorRes)
  }

  // Với các lỗi không dự đoán được (không phải AppError)
  console.error('❌ Unexpected error:', err)

  return res.status(500).json({
    message: 'Internal Server Error',
    error: err.message // hoặc log nhiều hơn nếu cần
  })
}
