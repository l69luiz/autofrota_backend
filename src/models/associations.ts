// src/models/associations.ts

import { Estoque } from "./estoques";
import { Empresa } from "./Empresas";

// Definir as associações entre Estoque e Empresa
Empresa.hasMany(Estoque, {
  foreignKey: "Empresas_idEmpresa",
  as: "estoques",
});

Estoque.belongsTo(Empresa, {
  foreignKey: "Empresas_idEmpresa",
  as: "empresa",
});
