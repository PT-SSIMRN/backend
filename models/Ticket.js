import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Ticket = sequelize.define(
  "Ticket",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT, // Cambiado de STRING a TEXT para mensajes largos
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Cambiado a true para permitir usuarios eliminados
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tickets",
    timestamps: true,
    paranoid: false, // Desactiva soft delete explícitamente
  }
);

export default Ticket;
