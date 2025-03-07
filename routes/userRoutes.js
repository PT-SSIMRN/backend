import express from "express";
import {
  register,
  login,
  logout,
  updateUser,
} from "../controllers/userController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/:id", authenticateUser, updateUser); // Solo autenticados pueden modificar usuarios

export default router;
