// src/config/database.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST!,
    dialect: "mysql",
    port: Number(process.env.DB_PORT!),
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Banco de dados conectado!"))
  .catch((err) => console.error("Erro ao conectar ao banco:", err));








