import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utilities/axiosInstance";

export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/login',
        {
          username,
          password,
        });
      const token = response?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      toast.success("Login Successful");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  },
);

export const registerUserThunk = createAsyncThunk(
  "user/signup",
  async ({ fullName, username, password, gender }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/register',
        {
          fullName,
          username,
          password,
          gender,
        }
      );
      toast.success("Registration Successfully!!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  },
);

export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/logout");
      toast.success("Logout successfull!!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getUserProfileThunk = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/get-profile");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      return rejectWithValue(errorOutput);
    }
  }
);

export const getOtherUsersThunk = createAsyncThunk(
  "user/getOtherUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/get-other-users");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      return rejectWithValue(errorOutput);
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      console.log("updateUserProfileThunk payload:", updatedData);

      const formData = new FormData();

      if (updatedData.fullName) formData.append("fullName", updatedData.fullName);
      if (updatedData.username) formData.append("username", updatedData.username);
      if (updatedData.bio) formData.append("bio", updatedData.bio);
      if (updatedData.gender) formData.append("gender", updatedData.gender);
      if (updatedData.password) formData.append("password", updatedData.password);
      if (updatedData.confirmPassword) formData.append("confirmPassword", updatedData.confirmPassword);
      if (updatedData.avatar) formData.append("avatar", updatedData.avatar);

      const response = await axiosInstance.put("/users/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("response from server:", response.data);
      return response.data.user;
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorOutput =
        error?.response?.data?.message ||
        error?.response?.data?.errMessage ||
        "Failed to update profile";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);
