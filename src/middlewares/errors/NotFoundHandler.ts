// src/middlewares/NotFoundHandler.ts

import { AppError } from '@utils/error/AppError.js'
import { NextFunction, Request, Response } from 'express'

export const NotFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Not found`, 404, false, `Route ${req.method} ${req.originalUrl}`))
}
