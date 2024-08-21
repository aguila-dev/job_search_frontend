export interface UserState {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  authenticated: boolean
}
export interface AuthTokenState {
  token: string
  auth: UserState | null
}
export interface AuthState {
  data: AuthTokenState | null
  loading: boolean
  error: string | null
}
