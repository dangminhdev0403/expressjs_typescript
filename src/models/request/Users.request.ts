interface RegisterRequestBody {
  name: string
  email: string
  password: string
  date_of_birth: string
}

interface logoutRequestBody {
  refresh_token: string
}
export { logoutRequestBody, RegisterRequestBody }
