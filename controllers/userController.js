import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import Department from "../models/Department.js";

const SECRET_KEY = process.env.JWT_SECRET || "claveSecreta123";

// **Crear primer administrador (solo si no hay usuarios)**
export const createFirstAdmin = async (req, res) => {
  try {
    // Verificar si ya existe algún usuario
    const userCount = await User.count();
    if (userCount > 0) {
      return res.status(403).json({
        error:
          "Ya existen usuarios en el sistema. Este endpoint solo debe usarse para la primera configuración.",
      });
    }

    const { username, password, department_id } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario administrador
    const user = await User.create({
      username,
      password: hashedPassword,
      department_id,
      isadmin: true,
    });

    res.status(201).json({
      message: "Usuario administrador creado exitosamente",
      user: {
        id: user.id,
        username: user.username,
        department_id: user.department_id,
        isadmin: user.isadmin,
      },
    });
  } catch (error) {
    console.error("Error al crear el primer administrador:", error);
    res.status(500).json({ error: "Error al crear el usuario administrador" });
  }
};

// **Obtener todos los usuarios (solo admins)**
export const fetchAllUsers = async (req, res) => {
  try {
    // Verificar si el usuario que hace la petición es admin
    if (!req.user.isadmin) {
      return res.status(403).json({
        error: "Solo los administradores pueden ver todos los usuarios",
      });
    }

    // Obtener todos los usuarios con sus departamentos
    const users = await User.findAll({
      include: [
        {
          model: Department,
          as: "department",
          attributes: ["id", "name"],
        },
      ],
      attributes: { exclude: ["password"] },
    });

    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// **Registro de usuario (solo admins)**
export const register = async (req, res) => {
  try {
    // Verificar si el usuario que hace la petición es admin
    if (!req.user.isadmin) {
      return res
        .status(403)
        .json({ error: "Solo los administradores pueden crear usuarios" });
    }

    const { username, password, department_id, isadmin } = req.body;

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
      isadmin: isadmin || false,
    });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: {
        id: user.id,
        username: user.username,
        department_id: user.department_id,
        isadmin: user.isadmin,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error al crear el usuario" });
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

    // Generar token JWT sin expiración
    const token = jwt.sign(
      { id: user.id, username: user.username, isadmin: user.isadmin },
      process.env.JWT_SECRET
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
    // Verificar si el usuario que hace la petición es admin
    if (!req.user.isadmin) {
      return res
        .status(403)
        .json({ error: "Solo los administradores pueden modificar usuarios" });
    }

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

export const deleteUser = async (req, res) => {
  try {
    // Verificar si el usuario que hace la petición es admin
    if (!req.user.isadmin) {
      return res
        .status(403)
        .json({ error: "Solo los administradores pueden eliminar usuarios" });
    }

    const { id } = req.params; // ID del usuario a eliminar

    // Verificar si el usuario existe
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Eliminar el usuario
    await user.destroy();

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};
