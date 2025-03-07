import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ChangeHistory = sequelize.define(
  "ChangeHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    previous_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    new_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "changes_history",
    timestamps: true,
    createdAt: "change_date",
    updatedAt: false,
  }
);

export default ChangeHistory;
