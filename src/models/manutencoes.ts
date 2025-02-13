// src/models/manutencoes.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Usuario } from "./usuarios"; // Importando o model Usuario
import { Veiculo } from "./veiculos"; // Importando o model Veiculo

export class Manutencao extends Model {
  public idManutencao!: number;
  public Tipo_Manut!: string | null;
  public Km_Manut!: number | null;
  public Pecas_Manut!: string | null;
  public Servico_Manut!: string | null;
  public Nr_NF_Manut!: string | null;
  public Oficina_Manut!: string | null;
  public Vr_Manut!: number | null;
  public Veiculo_idVeiculo!: number;
  public Data_Manutencao!: Date | null;
  public Usuarios_idUsuario!: number;
}

Manutencao.init(
  {
    idManutencao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Tipo_Manut: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Km_Manut: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Pecas_Manut: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Servico_Manut: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Nr_NF_Manut: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Oficina_Manut: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Vr_Manut: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Veiculo_idVeiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Veiculo, // Relacionamento com a tabela Veiculo
        key: "idVeiculo",
      },
    },
    Data_Manutencao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Usuarios_idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario, // Relacionamento com a tabela Usuarios
        key: "idUsuario",
      },
    },
  },
  {
    sequelize,
    modelName: "Manutencao",
    tableName: "Manutencoes",
    timestamps: true,
  }
);

// Relacionamentos com Usuarios e Veiculo
Manutencao.belongsTo(Usuario, {
  foreignKey: "Usuarios_idUsuario",
  as: "usuario",
});

Manutencao.belongsTo(Veiculo, {
  foreignKey: "Veiculo_idVeiculo",
  as: "veiculo",
});
