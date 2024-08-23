export type AuthResponse = { accessToken: string }

export interface AuthUserProps {
  email: string
  password: string
  method: string
  firstName?: string
  lastName?: string
}

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
export interface AuthReduxState {
  data: AuthTokenState | null
  loading: boolean
  error: string | null
}
