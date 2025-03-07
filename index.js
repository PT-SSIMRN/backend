import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./models/index.js";
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

// Sincronización de modelos
sequelize
  .sync({ alter: true }) // En producción, usa migraciones en lugar de sync()
  .then(() => console.log("Base de datos sincronizada correctamente"))
  .catch((err) => console.error("Error al sincronizar la BD:", err));

// Rutas
app.use("/api/tickets", ticketRoutes); // Aquí apuntas las rutas para tickets
app.use("/api/users", userRoutes); // Aquí apuntas las rutas para usuarios
app.get("/", (req, res) => res.send("Servidor funcionando"));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
