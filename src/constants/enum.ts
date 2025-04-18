enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  VerifyToken
}

export { TokenType, UserVerifyStatus }
