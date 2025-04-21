import { TokenType } from '@constants/enum.js'
import jwt from 'jsonwebtoken'

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
const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  option = { algorithm: 'HS256' }
}: SignTokenParams): Promise<string> => {
  const isAccessToken = typeof payload === 'object' && 'type' in payload && payload.type === TokenType.AccessToken
  const expiresIn = isAccessToken ? expireToken : expireRefreshToken

  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, { ...option, expiresIn }, (err, token) => {
      if (err || !token) return reject(err || new Error('Failed to sign token'))
      resolve(token)
    })
  })
}

const verifyToken = async ({
  token,
  privateKey = process.env.JWT_SECRET as string
}: {
  token: string
  privateKey?: string
}) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) {
        throw reject(err)
      }
      if (!decoded) {
        return reject(new Error('Failed to verify token'))
      }
      resolve(decoded as jwt.JwtPayload)
    })
  })
}
export { signToken as default, verifyToken }
