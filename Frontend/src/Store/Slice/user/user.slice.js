import { createSlice } from '@reduxjs/toolkit';
import { loginUserThunk } from './user.thunk';
import { registerUserThunk } from './user.thunk';
import { logoutUserThunk } from './user.thunk';
import { getUserProfileThunk } from './user.thunk';
import { getOtherUsersThunk } from './user.thunk';
import { updateUserProfileThunk } from './user.thunk';


const initialState = {
  isAuthenticated: false,
  screenloading: false,
  userProfile: null,
  otherUsers: null,
  selectedUser: JSON.parse(localStorage.getItem("selectedUser")),
  buttonloading: false,

};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      localStorage.setItem("selectedUser", JSON.stringify(action.payload))
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {

    // Login User

    builder.addCase(loginUserThunk.pending, (state, action) => {
      state.buttonloading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonloading = false;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.buttonloading = false;
    });

    // Register User
    builder.addCase(registerUserThunk.pending, (state, action) => {
      state.buttonloading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.buttonloading = false;
      state.isAuthenticated = true;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.buttonloading = false;
    });

    // Logout User
    builder.addCase(logoutUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state, action) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.otherUsers = null;
      state.isAuthenticated = false;
      state.buttonLoading = false;
      localStorage.clear();
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
    });


    // get user profile
    builder.addCase(getUserProfileThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.screenLoading = false;
      state.userProfile = action.payload?.responseData;
    });
    builder.addCase(getUserProfileThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    // get other users
    builder.addCase(getOtherUsersThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.otherUsers = action.payload?.responseData;
    });
    builder.addCase(getOtherUsersThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });

    // update user profile
    builder.addCase(updateUserProfileThunk.pending, (state, action) => {
      state.buttonloading = true;
    });

    builder.addCase(updateUserProfileThunk.fulfilled, (state, action) => {
      state.buttonloading = false;
      state.userProfile = action.payload?.responseData?.user || action.payload?.user || action.payload;
    });

    builder.addCase(updateUserProfileThunk.rejected, (state, action) => {
      state.buttonloading = false;
    });


  },

})



export const { setSelectedUser } = userSlice.actions

export default userSlice.reducer;