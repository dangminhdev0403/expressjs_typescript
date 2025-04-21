import { MongoDBClient } from '@config/MongoDBClient.js'
import { morganMiddleware } from '@config/morgan.js'
import { errorHandler } from '@middlewares/errors/errorHandler.js'
import { NotFoundHandler } from '@middlewares/errors/NotFoundHandler.js'
import usersRouter from '@routers/users.routers.js'
import express, { ErrorRequestHandler } from 'express'

const port = 8080
const app = express()

// Lấy địa chỉ IP nội bộ (LAN)
// function getLocalIPAddress() {
//   const interfaces = os.networkInterfaces()
//   for (const name of Object.keys(interfaces)) {
//     for (const iface of interfaces[name] || []) {
//       if (iface.family === 'IPv4' && !iface.internal) {
//         return iface.address
//       }
//     }
//   }
//   return '127.0.0.1' // fallback
// }

const ip = '127.0.0.1'

app.use(express.json())
app.use(morganMiddleware)

// Route test
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', (req, res) => {
  res.send('Hello World2!')
})

// Gắn router người dùng
app.use('/users', usersRouter)

app.use(NotFoundHandler)
// đặt cuối cùng
app.use(errorHandler as unknown as ErrorRequestHandler)

async function startServer() {
  try {
    const dbClient = MongoDBClient.getInstance()
    await dbClient.connect()

    app.listen(port, ip, () => {
      console.log(`🚀 Server listening on http://${ip}:${port}`)
    })
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

startServer()
