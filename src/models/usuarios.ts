// src/models/usuario.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database"; // ou onde estiver a configuração do seu banco

export class Usuario extends Model {
  public idUsuario!: number;
  public Nome!: string;
  public CPF_CNPJ!: string;
  public Rua!: string;
  public Numero!: string;
  public Bairro!: string;
  public Cidade!: string;
  public Celular!: string;
  public Celular2!: string;
  public RG!: string;
  public Tipo!: string;
  public Email!: string;
  public Senha!: string; // Adicionando a senha
  public Grupo!: string;
}

Usuario.init(
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CPF_CNPJ: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Rua: DataTypes.STRING,
    Numero: DataTypes.STRING,
    Bairro: DataTypes.STRING,
    Cidade: DataTypes.STRING,
    Celular: DataTypes.STRING,
    Celular2: DataTypes.STRING,
    RG: DataTypes.STRING,
    Tipo: DataTypes.STRING,
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Grupo: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "Usuarios",
    timestamps: true,
  }
);
