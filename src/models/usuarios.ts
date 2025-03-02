// src/models/usuarios.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Empresa } from "./Empresas"; // Import do model Empresa

export class Usuario extends Model {
  public idUsuario!: number;
  public Nome!: string;
  public CPF_CNPJ!: string;
  public Rua!: string | null;
  public Numero!: string | null;
  public Bairro!: string | null;
  public Cidade!: string | null;
  public Celular!: string | null;
  public Celular2!: string | null;
  public RG!: string | null;
  public Tipo!: string | null;
  public Cargo!: string | null;
  public Salario!: number | null;
  public Data_Admissao!: Date | null;
  public Email!: string;
  public Senha!: string;
  public Grupo!: string | null;
  public Data_Demissao!: Date | null;
  public Empresas_idEmpresa!: number;
  public Status!: boolean | null;
}

Usuario.init(
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    CPF_CNPJ: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true,
    },
    Rua: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Numero: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    Bairro: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Cidade: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Celular: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    Celular2: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    RG: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Tipo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Cargo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Salario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Data_Admissao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    Senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Grupo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    Data_Demissao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Empresas_idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Empresa, // Relacionamento com a tabela Empresas
        key: "idEmpresa",
      },
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },


  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "Usuarios",
    timestamps: true,
  }
);

// Relacionamento com Empresas (Um usuário pertence a uma empresa)
Usuario.belongsTo(Empresa, {
  foreignKey: "Empresas_idEmpresa",
  as: "empresa",
});

