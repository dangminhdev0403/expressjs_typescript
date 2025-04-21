import { loginController, logoutController, registerController } from '@controllers/users.controller.js'
import { accessTokenValidator, loginValidator, registerValidator } from '@middlewares/users.middlewares.js'
import { validate, validates } from '@utils/validation.js'
import { Router } from 'express'
import { ValidationChain } from 'express-validator'

const usersRouter = Router()

usersRouter.post('/login', validates(loginValidator() as unknown as ValidationChain[]), loginController)

usersRouter.post('/register', validate(registerValidator), registerController)

usersRouter.post('/logout', accessTokenValidator, logoutController)

export default usersRouter
