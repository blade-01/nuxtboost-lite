interface SignInResponse {
  result: boolean
  message: string
  data: {
    token: string
  }
}
