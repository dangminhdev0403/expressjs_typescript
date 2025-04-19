// src/types/express/index.d.ts
import { User } from '@models/User.model' // hoặc interface tương ứng

declare global {
  namespace Express {
    interface Request {
      user?: User // hoặc kiểu bạn định nghĩa, ví dụ:
      // user?: { user_id: string, email: string, name: string }
    }
  }
}
