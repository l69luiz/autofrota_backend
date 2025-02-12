// src/models/associations.ts

import { Estoque } from "./estoques";
import { Loja } from "./lojas";

// Definir as associações entre Estoque e Loja
Loja.hasMany(Estoque, {
  foreignKey: "Lojas_idLoja",
  as: "estoques",
});

Estoque.belongsTo(Loja, {
  foreignKey: "Lojas_idLoja",
  as: "loja",
});
