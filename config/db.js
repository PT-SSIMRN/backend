import dotenv from "dotenv";
import Sequelize from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la BD establecida");
  } catch (error) {
    console.error("Error al conectar a la BD:", error);
  }
};

testConnection();

export default sequelize;
