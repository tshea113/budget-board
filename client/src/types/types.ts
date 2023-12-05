export type APIResponse<T> = {
  success: boolean
  content: T
  status?: number
}

export type UserInfo = {
  uid: string | null
}
