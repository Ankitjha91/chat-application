import User from '../models/user.model.js';
import { asyncHandler } from '../utilities/asyncHandler.utility.js';
import { errorHandler } from '../utilities/errorHandler.utility.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from "fs";
import path from "path";




export const register = asyncHandler(async (req, res, next) => {
  const { fullName, username, password, gender } = req.body;

  // validation
  if (!fullName || !username || !password || !gender) {
    return next(new errorHandler('All fields are required', 400));
  }

  // check if username exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return next(new errorHandler('Username already exists', 400));
  }

  // avatar
  const avatarType = gender === "male" ? "boy" : "girl";
  const avatar = `https://avatar.iran.liara.run/public/${avatarType}?username=${username}`;

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const newUser = await User.create({
    fullName,
    username,
    password: hashedPassword,
    gender,
    avatar
  });


  const tokenData = {
    _id: newUser?._id
  }

  const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });



  // response
  res
    .status(200)
    .cookie("token", token,  {
      expire: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    .json({
      success: true,
      responseData: {
       user: newUser,
        token
      }

    });
});


export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // validation
  if (!username || !password) {
    return next(new errorHandler('Please enter a valid username and Password', 400));
  }

  // check if username exists
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    return next(new errorHandler('Please enter a valid username and Password', 400));
  }

  // hash password
  const isValidPassword = await bcrypt.compare(password, existingUser.password);
  if (!isValidPassword) {
    return next(new errorHandler('Please enter a valid username and Password', 400));
  }

  const tokenData = {
    _id: existingUser?._id
  }

  const token = jwt.sign(tokenData, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN });


  // response
  res
    .status(200)
    .cookie("token", token, {
      expire: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      // domain : process.env.FRONTEND_URL
    })
    .json({
      success: true,
      ResponseData: {
        existingUser,
        token
      }
    });

});


export const getProfile = asyncHandler(async (req, res, next) => {
//  console.log(req.user);
 const userId = req.user._id;
//  console.log(userId);

 const profile = await User.findById(userId)

  res.status(200).json({
    success: true,
    responseData: profile,
  }); 

});

export const logout = asyncHandler(async (req, res, next) => {

  res
  .status(200)
  .cookie("token", "", {
      expire: new Date(Date.now ()),
      httpOnly: true,
    })
  .json({
    success: true,
    message: "Logged out successfully",
  }); 

});

export const getOtherUsers= asyncHandler(async (req, res, next) => {

  const otherUsers = await User.find({_id: {$ne: req.user._id}});

  res.status(200).json({
    success: true,
    responseData: otherUsers,
  });  

});

// Update User Profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) {
    return next(new errorHandler("Unauthorized access", 401));
  }

  const {
    fullName,
    username,
    password,
    confirmPassword,
    bio,
    gender,
  } = req.body;

  const updates = {};

  if (fullName !== undefined) updates.fullName = fullName;
  if (username !== undefined) updates.username = username;
  if (bio !== undefined) updates.bio = bio;
  if (gender !== undefined) updates.gender = gender;

  // 🧠 Password update handle
  if (password && confirmPassword) {
    if (password !== confirmPassword) {
      return next(new errorHandler("Passwords do not match", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.password = hashedPassword;
  }

  // 🖼️ Avatar update handle
  if (req.file) {
    updates.avatar = `/uploads/${req.file.filename}`;

    try {
      const existingUser = await User.findById(userId);
      if (existingUser && existingUser.avatar && existingUser.avatar.startsWith("/uploads")) {
        const oldFilePath = path.join(process.cwd(), existingUser.avatar);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // delete old avatar
        }
      }
    } catch (err) {
      console.warn("Failed to delete old avatar:", err.message);
    }
  }

  // ✅ Update user in database
  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    return next(new errorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully!",
    user: updatedUser,
  });
});

