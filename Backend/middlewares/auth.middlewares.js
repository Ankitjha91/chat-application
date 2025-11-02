import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import jwt from "jsonwebtoken";


export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // console.log(req.cookies);


 const token =
    req.cookies?.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.replace("Bearer ", "")
      : null);

//  console.log(token);

  if (!token) {
    return next(new errorHandler("Not authorized to access this route", 401));
  }

  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = tokenData; 
  next();

});


