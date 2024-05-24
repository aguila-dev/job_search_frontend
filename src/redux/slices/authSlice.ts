import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../interfaces';
import { loginOrSignup, logout } from '../../api/auth';

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const token = await loginOrSignup(email, password, 'login');
      return token;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const token = await loginOrSignup(email, password, 'signup');
      return token;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await logout();
  } catch (error: any) {
    console.error('Error logging out:', error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    // loginStart(state) {
    //   state.loading = true;
    //   state.error = null;
    // },
    // loginSuccess(state, action: PayloadAction<string>) {
    //   state.token = action.payload;
    //   state.loading = false;
    // },
    // loginFailure(state, action: PayloadAction<string>) {
    //   state.error = action.payload;
    //   state.loading = false;
    // },
    // logoutUser(state) {
    //   state.token = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setToken, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
