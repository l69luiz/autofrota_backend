// src/config/database.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { Loja } from "../models/lojas";  // Importando os modelos
//import { Estoque } from "../models/estoques";  // Importando os modelos

dotenv.config();

// Criação da instância do Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST!,
    dialect: "mysql",
    port: Number(process.env.DB_PORT!),
    logging: false,  // Pode ativar se quiser ver os logs do Sequelize
  }
);

// Testa a conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log("Banco de dados conectado!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco:", err);
  });



// Opcional: Sincronizar o banco de dados (dependendo da sua necessidade)
// sequelize.sync({ alter: true }).then(() => {
//   console.log("Tabelas sincronizadas!");
// });





// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

// export const sequelize = new Sequelize(
//   process.env.DB_NAME!,
//   process.env.DB_USER!,
//   process.env.DB_PASS!,
//   {
//     host: process.env.DB_HOST!,
//     dialect: "mysql",
//     port: Number(process.env.DB_PORT!),
//   }
// );

// sequelize
//   .authenticate()
//   .then(() => console.log("Banco de dados conectado!"))
//   .catch((err) => console.error("Erro ao conectar ao banco:", err));








