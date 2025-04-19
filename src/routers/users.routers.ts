import { loginController, registerController } from '@controllers/users.controller.js'
import { registerValidator, validateEmailSchema, validatePasswordSchema } from '@middlewares/users.middlewares.js'
import { validate, validates } from '@utils/validation.js'
import { Router } from 'express'
import { ValidationChain } from 'express-validator'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.send('users')
})

usersRouter.post(
  '/login',
  validates([validateEmailSchema, validatePasswordSchema] as unknown as ValidationChain[]),
  loginController
)

usersRouter.post('/register', validate(registerValidator), registerController)

export default usersRouter
