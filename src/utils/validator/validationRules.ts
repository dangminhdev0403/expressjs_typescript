// utils/validationRules.ts
import userService from '@services/UserService.js'
import { hashPassword } from '@utils/cryto.js'
import { messages } from '@utils/validationMessages.js'
import { CustomValidator, Schema } from 'express-validator'

export const nameRule: Schema[string] = {
  isString: { errorMessage: messages.mustBeString('Name') },
  notEmpty: { errorMessage: messages.required('Name') },
  isLength: {
    options: { min: 3, max: 100 },
    errorMessage: messages.lengthBetween('Name', 3, 100)
  },
  trim: true
}

export const emailRule = (checkExist = false, mustExist = false): Schema[string] => ({
  notEmpty: { errorMessage: messages.required('Email') },
  isEmail: { errorMessage: messages.invalidEmail },
  normalizeEmail: true,
  trim: true,
  custom: {
    options: (async (value, { req }) => {
      const user = await userService.checkEmailExist(value)

      if (checkExist && user) throw new Error('Email already exists')
      if (mustExist && !user) throw new Error('Email does not exist')

      req.user = user
      return true
    }) as CustomValidator
  }
})

export const passwordRule: Schema[string] = {
  isString: { errorMessage: messages.mustBeString('Password') },
  notEmpty: { errorMessage: messages.required('Password') },
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
}

export const confirmPasswordRule: Schema[string] = {
  ...passwordRule,
  isString: { errorMessage: messages.mustBeString('Confirm password') },
  notEmpty: { errorMessage: messages.required('Confirm password') },
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
}

export const checkPasswordMatchRule: Schema[string] = {
  ...passwordRule,
  custom: {
    options: (async (value, { req }) => {
      const user = req.user
      if (!user) throw new Error('User not found')

      const hashedInput = hashPassword(value)
      if (user.password !== hashedInput) {
        throw new Error('Invalid password')
      }

      return true
    }) as CustomValidator
  }
}

export const dobRule: Schema[string] = {
  isISO8601: {
    options: { strict: true, strictSeparator: true },
    errorMessage: messages.invalidDate
  }
}
