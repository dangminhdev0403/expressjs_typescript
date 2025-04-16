import { NextFunction, Request, Response } from 'express'

const loginValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body || {}

  console.log('Request body:', req.body)

  if (!email || !password) {
    res.status(400).json({ message: 'All fields must be filled' })
    return
  }

  next()
}

export { loginValidator }
