import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId
  user_id: string
  token: string
  created_at?: Date
}

class RefreshToken {
  _id?: ObjectId
  user_id: string
  token: string
  created_at?: Date

  constructor({ user_id, token, _id, created_at }: RefreshTokenType) {
    this.user_id = user_id
    this.token = token
    this._id = _id
    this.created_at = created_at ?? new Date()
  }
}

export { RefreshToken }
