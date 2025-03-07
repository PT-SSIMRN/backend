import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para crear un ticket
router.post("/", authenticateUser, createTicket);

// Ruta para obtener todos los tickets
router.get("/", authenticateUser, getTickets);

// Ruta para obtener un ticket por ID
router.get("/:id", authenticateUser, getTicketById);

// Ruta para actualizar un ticket
router.put("/:id", authenticateUser, updateTicket);

// Ruta para eliminar un ticket
router.delete("/:id", authenticateUser, deleteTicket);

export default router;
