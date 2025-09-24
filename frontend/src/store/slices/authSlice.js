import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false, 
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user } = action.payload;
      state.status = true;
      state.user = user;
      localStorage.setItem("authUser", JSON.stringify(user)); // optional
    },
    logout: (state) => {
      state.status = false;
      state.user = null;
      localStorage.removeItem("authUser");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
