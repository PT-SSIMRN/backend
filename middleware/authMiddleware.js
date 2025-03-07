import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET || "claveSecreta123";

// Middleware para verificar el token y extraer el usuario autenticado
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Acceso no autorizado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Agrega los datos del usuario autenticado a la request
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

export default authenticateUser;
