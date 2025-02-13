// src/models/lojas.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Loja extends Model {
  public idLoja!: number;
  public Nome_Loja!: string;
  public NomeFantasia_Loja!: string;
  public Endereco_Loja!: string;
  public Telefone_Loja!: string | null;
  public Email_Loja!: string | null;
  public CNPJ_Loja!: string;
  public CaminhoImgLoja!: string;
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
    NomeFantasia_Loja: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    Endereco_Loja: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Telefone_Loja: {
      type: DataTypes.STRING(20), // Ajustando para o tamanho correto
      allowNull: true,
    },
    Email_Loja: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CNPJ_Loja: {
      type: DataTypes.STRING(20), // Ajustando para o tamanho correto
      allowNull: false,
      unique: true,
    },
    CaminhoImgLoja: {
      type: DataTypes.STRING(120),
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "Loja",
    tableName: "Lojas",
  }
);




