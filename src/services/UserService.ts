import { getLogger } from '@config/logger.js'
import { MongoDBClient } from '@config/MongoDBClient.js'
import { TokenType } from '@constants/enum.js'
import { getCollection } from '@database/collectionFactory.js'
import { RegisterRequestBody } from '@models/request/Users.request.js'
import User from '@models/schemas/Users.chemas.js'
import { hashPassword } from '@utils/cryto.js'
import signToken from '@utils/jwt.js'
import { messages } from '@utils/validationMessages.js'

const logger = getLogger('UserService')

class UserService {
  private signToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
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
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )

    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signToken(user_id)
    return { access_token, refresh_token }
  }

  async checkEmailExist(email: string) {
    const usersCollection = getCollection('users')
    const user = await usersCollection.findOne({ email })
    // const user = await MongoDBClient.getInstance().users.findOne({ email })
    if (user) {
      logger.info('Check user: ' + JSON.stringify(user))
    } else {
      logger.info('No user found with the given email')
    }
    return user
  }

  async checkAccount({ email, password }: { email: string; password: string }) {
    const user = await MongoDBClient.getInstance().users.findOne({ email, password: hashPassword(password) })
    if (!user) throw new Error(messages.BAD_CREDENTIALS)
    return user
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signToken(user_id)
    return { access_token, refresh_token }
  }
}

const userService = new UserService()

export default userService
