import { loginController, registerController } from '@controllers/users.controller.js'
import { loginValidator } from '@middlewares/users.middlewares.js'
import { Router } from 'express'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.send('users')
})

usersRouter.post('/login', loginValidator, loginController)
// usersRouter.post('/register', (req, res, next) => {
//   registerController(req, res).catch(next)
// })
usersRouter.post('/register', registerController)

export default usersRouter
