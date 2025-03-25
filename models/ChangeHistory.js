import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Asegúrate que la ruta sea correcta

const ChangeHistory = sequelize.define(
  "ChangeHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticket_id: {
      // El ticket que fue modificado
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tickets", // Nombre de la tabla de tickets
        key: "id",
      },
      // Considera onDelete: 'CASCADE' si quieres que el historial se borre si se borra el ticket
    },
    user_id: {
      // El usuario que realizó el cambio
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Nombre de la tabla de usuarios
        key: "id",
      },
      // Considera onDelete: 'SET NULL' o 'NO ACTION'
    },
    field_changed: {
      // Qué campo del ticket se modificó (ej: 'status', 'priority', 'message')
      type: DataTypes.STRING,
      allowNull: false,
    },
    previous_value: {
      // Valor ANTES del cambio
      type: DataTypes.TEXT, // Usamos TEXT para acomodar mensajes largos
      allowNull: true, // Podría ser nulo si el campo se estableció por primera vez
    },
    new_value: {
      // Valor DESPUÉS del cambio
      type: DataTypes.TEXT,
      allowNull: true, // Podría ser nulo si el campo se borró (aunque no aplica mucho aquí)
    },
    // 'change_date' se manejará automáticamente por 'timestamps: true' y 'createdAt'
  },
  {
    tableName: "changes_history", // Nombre de la tabla
    timestamps: true, // Habilita createdAt y updatedAt
    createdAt: "change_date", // Renombra createdAt a change_date
    updatedAt: false, // No necesitamos updatedAt para un registro de historial
  }
);

export default ChangeHistory;
