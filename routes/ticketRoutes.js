// routes/ticketRoutes.js
import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getPriorities, // Asegúrate que está importado
  getCategories, // Añade la importación
  addComment,
  getStatus,
  createPriority,
  updatePriority,
  deletePriority,
  createCategory,
  updateCategory,
  deleteCategory,
  getMyTickets
} from "../controllers/ticketController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Rutas específicas PRIMERO ---
// Ruta para obtener las prioridades (protegida)
router.get("/priorities", getPriorities); // Movida ANTES de /:id

// Ruta para obtener las categorías (protegida)
router.get("/categories", getCategories); // Añadida ANTES de /:id

// Ruta para obtener los estados (protegida)
router.get("/status", getStatus);

// --- Rutas generales y con parámetros DESPUÉS ---
// Ruta para crear un ticket (protegida)
router.post("/", authenticateUser, createTicket);

// Ruta para obtener todos los tickets (protegida)
router.get("/", authenticateUser, getTickets);

// Ruta para obtener tickets por usuario
router.get("/mine", authenticateUser, getMyTickets);

// Ruta para obtener un ticket por ID (protegida)
router.get("/:id", authenticateUser, getTicketById); // Ahora se evaluará después de /priorities y /categories

// Ruta para actualizar un ticket (protegida)
router.put("/:id", authenticateUser, updateTicket);

// Ruta para eliminar un ticket (protegida)
router.delete("/:id", authenticateUser, deleteTicket);

// Ruta para agregar un comentario a un ticket (protegida)
router.post("/:id/comments", authenticateUser, addComment);

// CRUD Priorities (protegidas, requieren admin idealmente)
router.post("/priorities", authenticateUser, createPriority);
router.put("/priorities/:id", authenticateUser, updatePriority);
router.delete("/priorities/:id", authenticateUser, deletePriority);

// CRUD Categories (protegidas, requieren admin idealmente)
router.post("/categories", authenticateUser, createCategory);
router.put("/categories/:id", authenticateUser, updateCategory);
router.delete("/categories/:id", authenticateUser, deleteCategory);

export default router;
