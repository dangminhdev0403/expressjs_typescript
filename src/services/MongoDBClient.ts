import User from '@models/schemas/user.Chemas.js'
import dotenv from 'dotenv'
import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'

dotenv.config()

export class MongoDBClient {
  private static instance: MongoDBClient | null = null
  private readonly client: MongoClient
  private readonly uri: string
  private db: Db

  // Constructor private để tránh việc tạo nhiều instance

  private constructor() {
    this.uri = process.env.MONGO_URI as string
    this.client = new MongoClient(this.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(process.env.DB_NAME)
  }

  // Phương thức để lấy instance duy nhất của MongoDBClient
  public static getInstance(): MongoDBClient {
    MongoDBClient.instance ??= new MongoDBClient()
    return MongoDBClient.instance
  }

  // Kết nối đến MongoDB
  async connect(): Promise<void> {
    try {
      await this.client.db('admin').command({ ping: 1 })
      console.log('✅ Successfully connected to MongoDB!')
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error)
      throw error // Ném lỗi nếu kết nối không thành công
    }
  }

  // Đóng kết nối MongoDB
  async close(): Promise<void> {
    await this.client.close()
    console.log('🔒 MongoDB connection closed')
  }

  // Lấy đối tượng client MongoDB để thực hiện các thao tác khác nếu cần
  getClient(): MongoClient {
    return this.client
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_COLLECTION_USERS as string)
  }
}
