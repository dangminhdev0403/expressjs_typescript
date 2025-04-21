import { getLoggerForModule } from '@config/logger.js'
import { logoutRequestBody, RegisterRequestBody } from '@models/request/Users.request.js'
import { createResponse } from '@models/response/format.response.js'
import userService from '@services/UserService.js'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

// Đăng nhập
const logger = getLoggerForModule(import.meta.url)

const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as { _id: string }
    const result = await userService.login(user._id.toString())

    const response = createResponse(200, 'Đăng nhập thành công', result)
    logger.info('Đăng nhập thành công: ', { response })

    res.status(200).json(response)
  } catch (error) {
    logger.error('Lỗi khi đăng nhập:', error)
    const response = createResponse(500, 'Đăng nhập thất bại', null, (error as Error).message)
    res.status(500).json(response)
  }
}

// Đăng ký
const registerController = async (
  req: Request<ParamsDictionary, Record<string, unknown>, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const result = await userService.register(req.body)
    const response = createResponse(201, 'Đăng ký thành công', result)
    res.status(201).json(response)
  } catch (error) {
    logger.error('Lỗi khi đăng ký:', error)
    const response = createResponse(400, 'Đăng ký thất bại', null, (error as Error).message)
    res.status(400).json(response)
  }
}

// Đăng xuất
const logoutController = async (
  req: Request<ParamsDictionary, Record<string, unknown>, logoutRequestBody>,
  res: Response
): Promise<void> => {
  await userService.logout(req.body)
  const response = createResponse(200, 'Đăng xuất thành công')
  res.status(200).json(response)
}

export { loginController, logoutController, registerController }
