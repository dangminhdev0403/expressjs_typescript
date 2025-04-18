import { RegisterRequestBody } from '@models/request/Users.request.js'
import userService from '@services/UserService.js'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

const loginController = (req: Request, res: Response): void => {
  res.json({ message: 'Đăng nhập thành công' })
}

const registerController = async (
  req: Request<ParamsDictionary, Record<string, unknown>, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const result = await userService.register(req.body)
    res.json({
      message: 'Đăng ký thành công',
      data: result
    })
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error)
    res.status(400).json({ message: 'Đăng ký thất bại' })
  }
}

export { loginController, registerController }
