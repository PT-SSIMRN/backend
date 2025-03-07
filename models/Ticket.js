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
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "abierto",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  }
);

export default Ticket;
