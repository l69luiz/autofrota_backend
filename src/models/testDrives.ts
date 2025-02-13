// src/models/testDrives.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Usuario } from "./usuarios"; // Importando o model Usuario
import { Veiculo } from "./veiculos"; // Importando o model Veiculo
import { Cliente } from "./clientes"; // Importando o model Cliente

export class TestDrive extends Model {
  public idTestDrive!: number;
  public Data_TestDrive!: Date;
  public Clientes_idCliente!: number;
  public Usuarios_idUsuario!: number;
  public Veiculo_idVeiculo!: number;
}

TestDrive.init(
  {
    idTestDrive: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Data_TestDrive: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Clientes_idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cliente, // Relacionamento com a tabela Cliente
        key: "idCliente",
      },
    },
    Usuarios_idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario, // Relacionamento com a tabela Usuario
        key: "idUsuario",
      },
    },
    Veiculo_idVeiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Veiculo, // Relacionamento com a tabela Veiculo
        key: "idVeiculo",
      },
    },
  },
  {
    sequelize,
    modelName: "TestDrive",
    tableName: "TestDrives",
    timestamps: true,
  }
);

// Relacionamentos com Usuario, Veiculo e Cliente
TestDrive.belongsTo(Usuario, {
  foreignKey: "Usuarios_idUsuario",
  as: "usuario",
});

TestDrive.belongsTo(Veiculo, {
  foreignKey: "Veiculo_idVeiculo",
  as: "veiculo",
});

TestDrive.belongsTo(Cliente, {
  foreignKey: "Clientes_idCliente",
  as: "cliente",
});
