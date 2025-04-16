import usersRouter from '@routers/users.routers.js'
import { MongoDBClient } from '@services/MongoDBClient.js'
import express from 'express'

const port = 8080
const app = express()

app.use(express.json())

// Route test
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', (req, res) => {
  res.send('Hello World2!')
})

// Gắn router người dùng
app.use('/users', usersRouter)

async function startServer() {
  try {
    // Sử dụng Singleton để lấy instance của MongoDBClient
    const dbClient = MongoDBClient.getInstance()

    // Kết nối MongoDB
    await dbClient.connect()

    // Bắt đầu lắng nghe server
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1) // Dừng server nếu không kết nối được MongoDB
  }
}

startServer()
