import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Status = sequelize.define(
  "Status",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "status",
    timestamps: false,
  }
);

export default Status;
