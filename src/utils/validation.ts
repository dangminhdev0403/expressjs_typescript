import { AppError } from '@utils/error/AppError.js'
import express, { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema.js'

// can be reused by many routes
const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    throw new AppError('Validation error', 400, true, errors.mapped())
    // res.status(400).json({ errors: errors.mapped() })
  }
}

/**
 * Middleware to validate multiple schemas
 */
export const validates = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Chạy từng validation chain
    for (const validation of validations) {
      await validation.run(req)
    }

    // Kiểm tra lỗi sau khi chạy validation
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({ errors: errors.mapped() })
  }
}
export { validate }
