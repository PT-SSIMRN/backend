import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./config/db.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilita CORS, para evitar bloqueo entre puertos
app.use(morgan("dev")); // Registro de solicitudes HTTP, cambiar a "combined" en producción
app.use(express.json()); // Permite JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Permite formularios codificados

// Rutas
app.use("/api/tickets", ticketRoutes); // Aquí se apuntan las rutas para tickets
app.use("/api/users", userRoutes); // Aquí se apuntan las rutas para usuarios
app.get("/", (req, res) => res.send("Servidor funcionando"));

// Sincronización de modelos y inicio del servidor
try {
  await sequelize.authenticate();
  console.log("Conexión establecida con la base de datos.");
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Error al conectar con la base de datos:", error);
}
