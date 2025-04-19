import { RegisterRequestBody } from '@models/request/Users.request.js'
import userService from '@services/UserService.js'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

const loginController = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as { _id: string } // hoặc kiểu phù hợp với user của bạn

  const result = await userService.login(user._id.toString())

  res.status(200).json({ message: 'Đăng nhập thành công', data: result })
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
