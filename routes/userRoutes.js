import express from "express";
import {
  login,
  logout,
  register,
  updateUser,
  getDepartments,
  getMe,
  createFirstAdmin,
  fetchAllUsers,
} from "../controllers/userController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas (sin autenticación)
router.post("/first-admin", createFirstAdmin);
router.post("/login", login);
router.post("/logout", logout);

// Rutas protegidas (requieren autenticación)
router.get("/me", authenticateUser, getMe);
router.get("/departments", authenticateUser, getDepartments);
router.post("/register", authenticateUser, register);
router.put("/:id", authenticateUser, updateUser);
router.get("/all", authenticateUser, fetchAllUsers);

export default router;
