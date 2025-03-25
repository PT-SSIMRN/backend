import express from "express";
import {
  register,
  login,
  logout,
  updateUser,
  getDepartments,
} from "../controllers/userController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/departments", getDepartments);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/:id", authenticateUser, updateUser); // Solo autenticados pueden modificar usuarios

export default router;
