import { createHash } from 'crypto'

const sha256 = (hass: string) => {
  return createHash('sha256').update(hass).digest('hex')
}

const hashPassword = (passsword: string) => {
  return sha256(passsword + process.env.PASSWORD_SECRET)
}
export { hashPassword }
