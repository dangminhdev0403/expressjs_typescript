import { TokenType } from '@constants/enum.js'
import { RegisterRequestBody } from '@models/request/Users.request.js'
import User from '@models/schemas/user.Chemas.js'
import { MongoDBClient } from '@services/MongoDBClient.js'
import { hashPassword } from '@utils/cryto.js'
import signToken from '@utils/jwt.js'

class UserService {
  private async signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        type: TokenType.AccessToken
      }
    })
  }

  private async signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        type: TokenType.RefreshToken
      }
    })
  }
  async register(payload: RegisterRequestBody) {
    const result = await MongoDBClient.getInstance().users.insertOne(
      new User({ ...payload, data_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )

    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExist(email: string) {
    const user = await MongoDBClient.getInstance().users.findOne({ email })
    return Boolean(user)
  }
}

const userService = new UserService()

export default userService
