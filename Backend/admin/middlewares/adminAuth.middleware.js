import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";



export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return res.status(403).json({ message: "Access denied - Admins only" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};
