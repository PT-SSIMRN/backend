import express from "express";
import { register, login, getMe } from "../controllers/userController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateUser, getMe);

export default router;
