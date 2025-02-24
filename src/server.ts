// src/server.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
//import authRoutes from "./routes/routes";
import rotas from "./routes";
import { sequelize } from "./config/database"; // Conexão com o banco de dados
import "../src/models/associations"; // Importa e define as associações

const app = express();
app.use(cors({ origin: '*' }));// aceita todas origens. ALTERAR DEPOIS!!!!
app.use(bodyParser.json());

app.use("/auth", rotas);

//sequelize.sync().then(() => console.log("Tabelas sincronizadas!"));

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));

