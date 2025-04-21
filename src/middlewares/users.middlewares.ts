import userService from '@services/UserService.js'
import { hashPassword } from '@utils/cryto.js'
import { verifyToken } from '@utils/jwt.js'
import { validate } from '@utils/validation.js'
import { messages } from '@utils/validationMessages.js'
import { checkSchema } from 'express-validator'

export const registerValidator = checkSchema(
  {
    name: {
      isString: {
        errorMessage: messages.mustBeString('Name')
      },
      notEmpty: {
        errorMessage: messages.required('Name')
      },
      isLength: {
        options: { min: 3, max: 100 },
        errorMessage: messages.lengthBetween('Name', 3, 100)
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: messages.required('Email')
      },
      isEmail: {
        errorMessage: messages.invalidEmail
      },
      normalizeEmail: true,
      custom: {
        options: async (value: string) => {
          const result = await userService.checkEmailExist(value)
          if (result) throw new Error('Email already exists')
          return true
        }
      }
    },
    password: {
      isString: {
        errorMessage: messages.mustBeString('Password')
      },
      notEmpty: {
        errorMessage: messages.required('Password')
      },
      isLength: {
        options: { min: 6, max: 100 },
        errorMessage: messages.lengthBetween('Password', 6, 100)
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: messages.strongPassword
      }
    },
    confirmPassword: {
      isString: {
        errorMessage: messages.mustBeString('Confirm password')
      },
      notEmpty: {
        errorMessage: messages.required('Confirm password')
      },
      isLength: {
        options: { min: 6, max: 100 },
        errorMessage: messages.lengthBetween('Confirm password', 6, 100)
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: messages.strongPassword
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: messages.invalidDate
      }
    }
  },
  ['body']
)

export const validateEmailSchema = checkSchema(
  {
    email: {
      notEmpty: { errorMessage: messages.required('Email') },
      isEmail: { errorMessage: messages.invalidEmail },
      normalizeEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await userService.checkEmailExist(value)

          req.user = user

          if (!user) throw Error('Email does not exist')

          console.log('check email', user)

          return true
        }
      }
    }
  },
  ['body']
)

export const validatePasswordSchema = checkSchema(
  {
    password: {
      isString: { errorMessage: messages.mustBeString('Password') },
      notEmpty: { errorMessage: messages.required('Password') },
      isLength: {
        options: { min: 6, max: 100 },
        errorMessage: messages.lengthBetween('Password', 6, 100)
      },
      custom: {
        options: async (value, { req }) => {
          console.log('Checkk password')

          const user = req.user

          if (!user) throw Error('User not found')
          const hashedInput = hashPassword(value)
          if (user.password !== hashedInput) throw Error('Invalid password')
          return true
        }
      }
    }
  },
  ['body']
)

export const loginValidator = () => [...validateEmailSchema, ...validatePasswordSchema]

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: 'Header Authorization required'
        },
        custom: {
          options: async (value: string, { req }) => {
            // Kiểm tra header bắt đầu bằng 'Bearer '
            const bearerRegex = /^Bearer\s+/i // Không phân biệt hoa thường
            if (!bearerRegex.test(value)) {
              throw new Error('Header Authorization không hợp lệ: Yêu cầu token Bearer')
            }
            const accessToken = value.replace(bearerRegex, '')
            if (!accessToken) {
              throw new Error('Header Authorization không hợp lệ: Token rỗng')
            }
            const deacoded_auth = await verifyToken({ token: accessToken })

            req.deacoded_auth = deacoded_auth
            return true // Kiểm tra thành công
          }
        }
      },
      refresh_token: {
        notEmpty: {
          errorMessage: messages.required('Refresh token')
        },
        isString: {
          errorMessage: messages.mustBeString('Refresh token ')
        }
      }
    },
    ['headers', 'body']
  )
)
