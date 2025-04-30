import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Ticket } from "../models/index.js";
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

// **Editar un departamento (solo admins)**
export const updateDepartment = async (req, res) => {
  try {
    if (!req.user.isadmin) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const { id } = req.params;
    const { name } = req.body;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ error: "Departamento no encontrado" });
    }

    await department.update({ name });

    res.json({
      message: "Departamento actualizado exitosamente",
      department,
    });
  } catch (error) {
    console.error("Error al actualizar departamento:", error);
    res.status(500).json({ error: "Error al actualizar el departamento" });
  }
};

// **Eliminar un departamento (solo admins)**
export const deleteDepartment = async (req, res) => {
  try {
    if (!req.user.isadmin) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const { id } = req.params;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ error: "Departamento no encontrado" });
    }

    // Verificar si hay usuarios asociados antes de eliminar
    const usersWithDepartment = await User.findOne({
      where: { department_id: id },
    });
    if (usersWithDepartment) {
      return res.status(400).json({
        error: "No se puede eliminar un departamento con usuarios asociados",
      });
    }

    await department.destroy();

    res.json({ message: "Departamento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar departamento:", error);
    res.status(500).json({ error: "Error al eliminar el departamento" });
  }
};

// **Crear un nuevo departamento (solo admins)**
export const createDepartment = async (req, res) => {
  try {
    if (!req.user.isadmin) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ error: "El nombre del departamento es obligatorio" });
    }

    // Verificar si ya existe un departamento con ese nombre
    const existing = await Department.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: "El departamento ya existe" });
    }

    const department = await Department.create({ name });

    res.status(201).json({
      message: "Departamento creado exitosamente",
      department,
    });
  } catch (error) {
    console.error("Error al crear departamento:", error);
    res.status(500).json({ error: "Error al crear el departamento" });
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

export // En tu controlador de usuarios
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Actualizar los tickets del usuario para desvincularlos
    await Ticket.update({ user_id: null }, { where: { user_id: id } });

    // 2. Eliminar el usuario
    await User.destroy({
      where: { id },
    });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      error: "Error al eliminar usuario",
      details: error.message,
    });
  }
};
