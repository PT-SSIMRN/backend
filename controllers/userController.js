import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET || "claveSecreta123";

// **Registro de usuario**
export const register = async (req, res) => {
  try {
    const { username, department_id, password } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      username,
      department_id,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Usuario registrado con éxito", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

// **Login de usuario**
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario en la base de datos
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Usuario o contraseña incorrectos" });
    }

    // Comparar contraseña ingresada con la hasheada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Usuario o contraseña incorrectos" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, isadmin: user.isadmin },
      SECRET_KEY
    );

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
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
    const { username, password, department_id, isadmin } = req.body;
    const adminId = req.user.id; // ID del usuario autenticado (extraído del token)

    // Buscar al usuario autenticado para verificar si es admin
    const admin = await User.findByPk(adminId);
    if (!admin || admin.isadmin !== true) {
      return res.status(403).json({
        error:
          "Acceso denegado, solo administradores pueden modificar usuarios",
      });
    }

    // Buscar al usuario que se quiere modificar
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Si se proporciona una nueva contraseña, se hashea
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Actualizar usuario
    await user.update({
      username: username || user.username,
      department_id: department_id || user.department_id,
      password: hashedPassword,
      isadmin: typeof isadmin !== "undefined" ? isadmin : user.isadmin,
    });

    res.status(200).json({ message: "Usuario actualizado con éxito", user });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};
