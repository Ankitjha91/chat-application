import express from "express";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import {
    adminLogin,
    getAllUsers,
    updateUser,
    deleteUser,
    toggleBlockUser,
    getDashboardStats,
} from "../controllers/admin.controllers.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/users", verifyAdmin, getAllUsers);
router.patch("/users/:id", verifyAdmin, updateUser);
router.delete("/users/:id", verifyAdmin, deleteUser);
router.patch("/users/:id/toggle-block", verifyAdmin, toggleBlockUser);
router.get("/dashboard-stats", getDashboardStats);

export default router;
