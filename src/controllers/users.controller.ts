import User from '@models/schemas/user.Chemas.js'
import { MongoDBClient } from '@services/MongoDBClient.js'
import { NextFunction, Request, Response } from 'express'

const loginController = (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: 'Đăng nhập thành công' })
}

const registerController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body

  try {
    const result = await MongoDBClient.getInstance().users.insertOne(new User({ email, password }))
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
