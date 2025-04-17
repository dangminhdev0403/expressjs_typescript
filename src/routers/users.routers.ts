import { loginController, registerController } from '@controllers/users.controller.js'
import { registerValidator } from '@middlewares/users.middlewares.js'
import { validate } from '@utils/validation.js'
import { Router } from 'express'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.send('users')
})

usersRouter.post('/login', loginController)
// usersRouter.post('/register', (req, res, next) => {
//   registerController(req, res).catch(next)
// })
usersRouter.post('/register', validate(registerValidator), registerController)

export default usersRouter
