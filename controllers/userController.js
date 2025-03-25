import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import Department from "../models/Department.js";

const SECRET_KEY = process.env.JWT_SECRET || "claveSecreta123";

// **Registro de usuario**
export const register = async (req, res) => {
  try {
    const { username, password, department_id } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await User.create({
      username,
      password: hashedPassword,
      department_id,
      isadmin: false,
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, isadmin: user.isadmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user.id,
        username: user.username,
        department_id: user.department_id,
        isadmin: user.isadmin,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

// **Login de usuario**
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar el usuario
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, isadmin: user.isadmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        department_id: user.department_id,
        isadmin: user.isadmin,
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// **Logout de usuario (Borrar token en el cliente)**
export const logout = (req, res) => {
  res.json({ message: "Logout exitoso, borra el token en el cliente" });
};

// **Modificar usuario (solo admins)**
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario a modificar
    const { username, department_id, isadmin } = req.body;

    // Verificar si el usuario existe
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualizar el usuario
    await user.update({
      username,
      department_id,
      isadmin,
    });

    res.json({
      message: "Usuario actualizado exitosamente",
      user: {
        id: user.id,
        username: user.username,
        department_id: user.department_id,
        isadmin: user.isadmin,
      },
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

// **Obtener departamentos**
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    console.error("Error al obtener departamentos:", error);
    res.status(500).json({ error: "Error al obtener los departamentos" });
  }
};

// **Obtener información del usuario actual**
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    res.status(500).json({ error: "Error al obtener información del usuario" });
  }
};
