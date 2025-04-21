import userService from '@services/UserService.js'
import { hashPassword } from '@utils/cryto.js'
import { messages } from '@utils/validationMessages.js'
import { validate } from '@utils/validator/validation.js'
import { confirmPasswordRule, dobRule, emailRule, nameRule, passwordRule } from '@utils/validator/validationRules.js'
import { checkSchema } from 'express-validator'

export const registerValidator = checkSchema(
  {
    name: nameRule,
    email: emailRule(true),
    password: passwordRule,

    confirmPassword: confirmPasswordRule,

    date_of_birth: dobRule
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

export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        ...nameRule
      },
      date_of_birth: {
        optional: true,
        ...dobRule
      },
      bio: {
        optional: true,
        isString: {
          errorMessage: messages.mustBeString('Bio')
        }
      },
      location: {
        optional: true,
        isString: {
          errorMessage: messages.mustBeString('location')
        },
        trim: true
      },
      website: {
        optional: true,
        isString: {
          errorMessage: messages.mustBeString('location')
        },
        trim: true,
        isLength: {
          options: { max: 100, min: 10 },
          errorMessage: messages.lengthBetween('location', 10, 100)
        }
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: messages.mustBeString('avatar')
        },
        trim: true
      },
      coverPhoto: {
        optional: true
      }
    },

    ['body']
  )
)
