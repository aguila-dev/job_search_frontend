import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

import { loginOrSignup } from '../../api/auth'
import { AuthState } from '../interfaces'

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
      console.log('Response in authSlice\n:', response)
      return response
    } catch (error: any) {
      console.log('Error in authSlice\n:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const me = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('http://localhost:8000/v1/auth/me', {
        withCredentials: true,
      })
      console.log('Data in me thunk\n:', data)
      return data
    } catch (error: any) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await axios.post('http://localhost:8000/v1/auth/logout')
  } catch (error) {
    console.error('Error logging out:', error)
  }
})

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
        if (!state.data) {
          state.data = {
            token: action.payload,
            auth: null,
          }
        }
        state.loading = false
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(me.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(me.fulfilled, (state, action) => {
        state.data = {
          token: action.payload.token,
          auth: action.payload.user,
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

export const { setLoading, setError, logoutCurrentUser } = authSlice.actions
export default authSlice.reducer
