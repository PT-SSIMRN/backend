import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./models/index.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilita CORS, para evitar bloqueo entre puertos
app.use(morgan("dev")); // Registro de solicitudes HTTP, cambiar a "combined" en producción
app.use(express.json()); // Permite JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Permite formularios codificados

// Inicialización de Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

//middleware de socket.io
io.on("connection", (socket) => {
  console.log(`Conexión desde`, socket.id);
  socket.on("disconnect", () => {
    console.log(`Desconexión de`, socket.id);
  });
});

// Sincronización de modelos
sequelize
  .sync({ alter: true }) // En producción, usar migraciones en lugar de sync()
  .then(() => console.log("Base de datos sincronizada correctamente"))
  .catch((err) => console.error("Error al sincronizar la BD:", err));

// Rutas
app.use("/api/tickets", ticketRoutes); // Aquí se apuntan las rutas para tickets
app.use("/api/users", userRoutes); // Aquí se apuntan las rutas para usuarios
app.get("/", (req, res) => res.send("Servidor funcionando"));

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
