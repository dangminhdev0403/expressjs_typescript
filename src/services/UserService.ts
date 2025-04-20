import { getLogger } from '@config/logger.js'
import { MongoDBClient } from '@config/MongoDBClient.js'
import { TokenType } from '@constants/enum.js'
import { getCollection } from '@database/collectionFactory.js'
import { RegisterRequestBody } from '@models/request/Users.request.js'
import { RefreshToken } from '@models/schemas/RefreshToken.schema.js'
import User from '@models/schemas/Users.chemas.js'
import { hashPassword } from '@utils/cryto.js'
import signToken from '@utils/jwt.js'
import { messages } from '@utils/validationMessages.js'
import { Collection } from 'mongodb'

const logger = getLogger('UserService')

class UserService {
  private readonly usersCollection: Collection<User>
  private readonly refreshTokenCollection: Collection<RefreshToken>

  constructor() {
    this.usersCollection = getCollection<User>('users')
    this.refreshTokenCollection = getCollection<RefreshToken>('refresh_tokens')
  }

  private async signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, type: TokenType.AccessToken }
    })
  }

  private async signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, type: TokenType.RefreshToken }
    })
  }

  private signToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async register(payload: RegisterRequestBody) {
    const newUser = new User({
      ...payload,
      date_of_birth: new Date(payload.date_of_birth),
      password: hashPassword(payload.password)
    })

    const result = await this.usersCollection.insertOne(newUser)

    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signToken(user_id)

    await this.saveRefreshToken(user_id, refresh_token)
    return { access_token, refresh_token }
  }

  async checkEmailExist(email: string) {
    const user = await this.usersCollection.findOne({ email })
    if (user) {
      logger.info('Check user: ' + JSON.stringify(user))
    } else {
      logger.info('No user found with the given email')
    }
    return user
  }

  async saveRefreshToken(user_id: string, refresh_token: string): Promise<void> {
    await this.refreshTokenCollection.updateOne({ user_id }, { $set: { token: refresh_token } }, { upsert: true })
  }

  async checkAccount({ email, password }: { email: string; password: string }) {
    const hashed = hashPassword(password)
    const user = await this.usersCollection.findOne({ email, password: hashed })
    if (!user) {
      throw new Error(messages.BAD_CREDENTIALS)
    }
    return user
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signToken(user_id)
    await this.saveRefreshToken(user_id, refresh_token)

    return { access_token, refresh_token }
  }
}

await MongoDBClient.getInstance().connect()

const userService = new UserService()
export default userService
