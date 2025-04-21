interface RegisterRequestBody {
  name: string
  email: string
  password: string
  date_of_birth: string
}

interface LogoutRequestBody {
  refresh_token: string
}

interface UpdateUserRequestBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  avatar?: string
}
export { LogoutRequestBody, RegisterRequestBody, UpdateUserRequestBody }
