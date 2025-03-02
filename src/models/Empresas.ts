// src/models/Empresas.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Empresa extends Model {
  public idEmpresa!: number;
  public Nome_Empresa!: string;
  public NomeFantasia_Empresa!: string;
  public Endereco_Empresa!: string;
  public Telefone_Empresa!: string | null;
  public Email_Empresa!: string | null;
  public CNPJ_Empresa!: string;
  public CaminhoImgEmpresa!: string;
}

Empresa.init(
  {
    idEmpresa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nome_Empresa: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    NomeFantasia_Empresa: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    Endereco_Empresa: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Telefone_Empresa: {
      type: DataTypes.STRING(20), // Ajustando para o tamanho correto
      allowNull: true,
    },
    Email_Empresa: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CNPJ_Empresa: {
      type: DataTypes.STRING(20), // Ajustando para o tamanho correto
      allowNull: false,
      unique: true,
    },
    CaminhoImgEmpresa: {
      type: DataTypes.STRING(120),
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "Empresas",
    tableName: "Empresas",
  }
);




