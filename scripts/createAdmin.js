import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import sequelize from "../config/db.js";

const createAdminUser = async () => {
  try {
    // Verificar si ya existe algún usuario
    const userCount = await User.count();
    if (userCount > 0) {
      console.log(
        "Ya existen usuarios en la base de datos. Este script solo debe ejecutarse en una base de datos vacía."
      );
      return;
    }

    // Crear el usuario administrador
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      username: "admin",
      password: hashedPassword,
      department_id: 1, // Asegúrate de que este departamento exista
      isadmin: true,
    });

    console.log("Usuario administrador creado exitosamente");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log(
      "Por favor, cambia la contraseña después del primer inicio de sesión"
    );
  } catch (error) {
    console.error("Error al crear el usuario administrador:", error);
  } finally {
    // Cerrar la conexión
    await sequelize.close();
  }
};

// Ejecutar el script
createAdminUser();
