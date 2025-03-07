import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const BackupRegister = sequelize.define(
  "BackupRegister",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_route: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticket_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "backups_register",
    timestamps: true,
    createdAt: "backup_date",
    updatedAt: false,
  }
);

export default BackupRegister;
