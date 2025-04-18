import { UserVerifyStatus } from '@constants/enum.js'
import { ObjectId } from 'mongodb'

interface UserType {
  _id?: ObjectId
  name?: string
  email: string
  password: string
  verifyStatus?: UserVerifyStatus
  data_of_birth?: Date
  createdAt?: Date
  updatedAt?: Date
  emailVerifyToken?: string
  forgotPasswordToken?: string
  bio?: string
  location?: string
  website?: string
  avatar?: string
  coverPhoto?: string
}

export default class User {
  _id: ObjectId
  name: string
  email: string
  password: string
  verifyStatus: UserVerifyStatus
  data_of_birth: Date
  createdAt: Date
  updatedAt: Date
  emailVerifyToken: string
  forgotPasswordToken: string
  bio: string
  location: string
  website: string
  avatar: string
  coverPhoto: string

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id ?? new ObjectId()
    this.name = user.name ?? ''
    this.email = user.email
    this.password = user.password
    this.verifyStatus = user.verifyStatus ?? UserVerifyStatus.Unverified
    this.data_of_birth = user.data_of_birth || new Date()
    this.createdAt = user.createdAt || date
    this.updatedAt = user.updatedAt || date
    this.emailVerifyToken = user.emailVerifyToken ?? ''
    this.forgotPasswordToken = user.forgotPasswordToken ?? ''
    this.bio = user.bio ?? ''
    this.location = user.location ?? ''
    this.website = user.website ?? ''
    this.avatar = user.avatar ?? ''
    this.coverPhoto = user.coverPhoto ?? ''
  }
}
