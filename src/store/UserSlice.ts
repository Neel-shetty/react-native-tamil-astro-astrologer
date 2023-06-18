import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface UserState {
  loggedIn: boolean;
  userInChat: string | null;
}

const initialState: UserState = {
  loggedIn: false,
  userInChat: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setUserInChat: (state, action: PayloadAction<string | null>) => {
      state.userInChat = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setLoggedIn, setUserInChat} = userSlice.actions;

export default userSlice.reducer;
