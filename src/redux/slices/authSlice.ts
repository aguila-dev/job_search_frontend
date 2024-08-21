import { loginOrSignup } from '@/api/auth'
import { AuthState, UserState } from '@/redux/interfaces'
import { RootState } from '@/redux/store'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

axios.defaults.withCredentials = true

const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
}

interface AuthenticateProps {
  email: string
  password: string
  method: string
  firstName?: string
  lastName?: string
}

export const authenticateUser = createAsyncThunk(
  'auth/authenticate',
  async (
    { email, password, method, firstName, lastName }: AuthenticateProps,
    { rejectWithValue }
  ) => {
    try {
      const response = await loginOrSignup(
        email,
        password,
        method,
        firstName,
        lastName
      )
      if (!response) {
        return rejectWithValue('Invalid credentials')
      }
      const { accessToken } = response

      console.log(
        'loginOrSignup response from the authenticateUser thunk: \n',
        response,
        accessToken
      )

      return { accessToken }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      } else {
        return rejectWithValue('An unexpected error occurred.')
      }
    }
  }
)

export const me = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      console.log('State in me thunk:', state)
      const accessToken = state.auth.data?.token as string
      console.log('Access token before /me request:', accessToken)

      // if (!accessToken) {
      //   console.log('No access token found, attempting to refresh...')
      //   const { data } = await axios.post<{ accessToken: string }>(
      //     'http://localhost:8000/v1/auth/refresh-token',
      //     null,
      //     {
      //       withCredentials: true,
      //     }
      //   )

      //   console.log('New access token response: ', data)
      //   accessToken = data.accessToken
      // }

      if (!accessToken) {
        throw new Error('Failed to obtain token')
      }

      const { data } = await axios.get<{
        tokenValid: boolean
        accessToken: string
      }>('http://localhost:8000/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add Authorization header
        },
        withCredentials: true,
      })

      console.log('Data in me thunk:\n', data)
      if (!data.tokenValid) {
        throw new Error('Token is invalid')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      } else {
        return rejectWithValue('An unexpected error occurred.')
      }
    }
  }
)

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  (accessToken: string, { rejectWithValue }) => {
    try {
      const decodedUser = jwtDecode<UserState>(accessToken)
      return { token: accessToken, user: decodedUser }
    } catch (error) {
      return rejectWithValue('Failed to refresh access token')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await axios.post('http://localhost:8000/v1/auth/logout', null, {
        withCredentials: true,
      })
      dispatch(logoutCurrentUser())
      window.location.href = '/auth'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setToken(state, action: PayloadAction<string>) {
    //   state?.data?.token = action.payload;
    // },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearError(state) {
      state.error = null
    },
    logoutCurrentUser(state) {
      state.data = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        const { accessToken } = action.payload
        const decodedUser: UserState = jwtDecode(accessToken)
        state.data = {
          token: accessToken,
          auth: decodedUser,
        }
        state.loading = false
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.data = {
          token: action.payload.token,
          auth: action.payload.user,
        }
        state.loading = false
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(me.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(me.fulfilled, (state, action) => {
        const token = action.payload.accessToken
        const decodedUser: UserState = jwtDecode(token)
        state.data = {
          token,
          auth: decodedUser,
        }
        state.loading = false
      })
      .addCase(me.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = null
        state.loading = false
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setLoading, setError, logoutCurrentUser, clearError } =
  authSlice.actions
export default authSlice.reducer
