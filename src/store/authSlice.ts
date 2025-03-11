import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../api/supabase';

// Define the state type
interface AuthState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Async thunks for auth actions
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred during sign in');
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return rejectWithValue(error.message);
    }
    return null;
  } catch (error: any) {
    return rejectWithValue(error.message || 'An error occurred during sign out');
  }
});

export const getSession = createAsyncThunk('auth/getSession', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return rejectWithValue(error.message);
    }
    return data.session ? data.session.user : null;
  } catch (error: any) {
    return rejectWithValue(error.message || 'An error occurred while getting session');
  }
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign in
    builder.addCase(signIn.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Sign out
    builder.addCase(signOut.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
    });
    builder.addCase(signOut.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get session
    builder.addCase(getSession.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getSession.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(getSession.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
