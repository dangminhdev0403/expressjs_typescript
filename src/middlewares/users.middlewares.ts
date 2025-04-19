import userService from '@services/UserService.js'
import { hashPassword } from '@utils/cryto.js'
import { messages } from '@utils/validationMessages.js'
import { checkSchema } from 'express-validator'

export const registerValidator = checkSchema({
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
})

export const loginValidator = checkSchema({
  email: {
    notEmpty: {
      errorMessage: messages.required('Email')
    },
    isEmail: {
      errorMessage: messages.invalidEmail
    },
    normalizeEmail: true,
    trim: true,
    custom: {
      options: async (value: string, { req }) => {
        const user = await userService.checkEmailExist(value)
        if (!user) throw Error(messages.BAD_CREDENTIALS)
        req.user = user
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
    custom: {
      options: async (value: string, { req }) => {
        const user = req.user as { _id: string; password: string }
        if (user.password !== hashPassword(value)) throw Error(messages.BAD_CREDENTIALS)
        return true
      }
    }
  }
})
