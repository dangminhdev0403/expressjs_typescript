import { loginController, logoutController, registerController } from '@controllers/users.controller.js'
import { authenticationValidator } from '@middlewares/auth.middlewares.js'
import {
  accessTokenValidator,
  loginValidator,
  registerValidator,
  updateMeValidator
} from '@middlewares/users.middlewares.js'
import { validate, validates } from '@utils/validator/validation.js'
import { Router } from 'express'
import { ValidationChain } from 'express-validator'

const usersRouter = Router()

usersRouter.post('/login', validates(loginValidator() as unknown as ValidationChain[]), loginController)

usersRouter.post('/register', validate(registerValidator), registerController)

usersRouter.post('/logout', authenticationValidator, accessTokenValidator, logoutController)

usersRouter.put('/me', authenticationValidator, updateMeValidator)

export default usersRouter
