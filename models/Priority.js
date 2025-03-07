import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Priority = sequelize.define(
  "Priority",
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
    tableName: "priorities",
    timestamps: false,
  }
);

export default Priority;
