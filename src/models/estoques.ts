// src/models/estoques.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Empresa } from "./Empresas"; // Import do model Empresas

export class Estoque extends Model {
  public idEstoque!: number;
  public AreaTotal!: number;
  public AreaCoberta!: number;
  public Data_Abertura!: Date | null;
  public Status!: string | null;
  public Empresas_idEmpresa!: number;
  public Local!: string | null;
  public Nome!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Estoque.init(
  {
    idEstoque: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    AreaTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AreaCoberta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Data_Abertura: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    
    Empresas_idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Empresa, 
        key: 'idEmpresa',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    Local: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Nome: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Estoques",
    tableName: "Estoques", // Nome da tabela no banco de dados
    timestamps: true,
  }
);





