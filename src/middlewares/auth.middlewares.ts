import logger from '@config/logger.js'
import { AppError } from '@utils/error/AppError.js'
import { verifyToken } from '@utils/jwt.js'
import { validate } from '@utils/validator/validation.js'
import { checkSchema } from 'express-validator'

export const authenticationValidator = validate(
  checkSchema({
    Authorization: {
      notEmpty: {
        errorMessage: 'Header Authorization required'
      },
      custom: {
        options: async (value, { req }) => {
          const bearerRegex = /^Bearer\s+/i // Không phân biệt hoa thường
          const accessToken = value.replace(bearerRegex, '')

          if (!bearerRegex.test(value) && !accessToken) {
            logger.error('Header Authorization không hợp lệ: Yêu cầu token Bearer')
            throw new AppError('Header Authorization không hợp lệ: Yêu cầu token Bearer', 401)
          }

          const deacoded_auth = await verifyToken({ token: accessToken })

          req.deacoded_auth = deacoded_auth
          return true // Kiểm tra thành công
        }
      }
    }
  })
)
