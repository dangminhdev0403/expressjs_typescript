import jwt from 'jsonwebtoken'
import { TokenType } from '@constants/enum.js'

// Định nghĩa giá trị expiresIn
const expireToken = process.env.ACCESS_TOKEN_EXPIRES_IN ? parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN, 10) : 3600 // Mặc định 1 giờ nếu không thiết lập

const expireRefreshToken = process.env.REFRESH_TOKEN_EXPIRES_IN
  ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10)
  : 7 * 24 * 3600 // Mặc định 7 ngày nếu không thiết lập

// Interface cho tham số
interface SignTokenParams {
  payload: string | object | Buffer
  privateKey?: string
  option?: jwt.SignOptions
}

// Hàm signToken
const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  option = { algorithm: 'HS256' }
}: SignTokenParams): Promise<string> => {
  // Xác định expiresIn dựa trên type trong payload
  const expiresIn =
    typeof payload === 'object' && 'type' in payload && payload.type === TokenType.AccessToken
      ? expireToken
      : expireRefreshToken

  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, { ...option, expiresIn }, (err, token) => {
      if (err) {
        return reject(err)
      }
      if (!token) {
        return reject(new Error('Failed to sign token'))
      }
      resolve(token)
    })
  })
}

export default signToken
