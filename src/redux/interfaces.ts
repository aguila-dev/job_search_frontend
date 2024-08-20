interface UserState {
  email: string
  firstName: string
  lastName: string
  authenticated: boolean
}
interface AuthTokenState {
  token: string
  auth: UserState | null
}
export interface AuthState {
  data: AuthTokenState | null
  loading: boolean
  error: string | null
}
