
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

interface UserState {
  users: UserProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserProfile[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<UserProfile>) => {
      state.users.unshift(action.payload);
    },
    updateUser: (state, action: PayloadAction<UserProfile>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
