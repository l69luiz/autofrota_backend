// src/models/lojas.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
//import { Estoque } from "./estoques"; // Import do model Estoque

export class Loja extends Model {
  public idLoja!: number;
  public Nome_Loja!: string;
  public Endereco_Loja!: string;
  public Telefone_Loja!: string | null;
  public Email_Loja!: string | null;
  public CNPJ_Loja!: string;
}

Loja.init(
  {
    idLoja: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nome_Loja: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Endereco_Loja: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Telefone_Loja: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    Email_Loja: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CNPJ_Loja: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Loja",
    tableName: "Lojas",
    timestamps: true,
  }
);

// Relacionamento com Estoque (Uma loja pode ter vários estoques)
// Loja.hasMany(Estoque, {
//   foreignKey: "Lojas_idLoja",
//   as: "estoques",
// });
