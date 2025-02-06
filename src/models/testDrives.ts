// src/models/testDrives.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Cliente } from "./clientes"; // Importando o model Cliente
import { Usuario } from "./usuarios"; // Importando o model Usuario

export class TestDrive extends Model {
  public idTestDrive!: number;
  public Data_TestDrive!: Date;
  public Clientes_idCliente!: number;
  public Usuarios_idUsuarios!: number;
  public Usuarios_idUsuario!: number;
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
    Usuarios_idUsuarios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario, // Relacionamento com a tabela Usuario
        key: "idUsuario",
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
  },
  {
    sequelize,
    modelName: "TestDrive",
    tableName: "TestDrives",
    timestamps: false,
  }
);

// Relacionamento com a tabela Cliente
TestDrive.belongsTo(Cliente, {
  foreignKey: "Clientes_idCliente",
  as: "cliente",
});

// Relacionamento com a tabela Usuario (do campo Usuarios_idUsuarios)
TestDrive.belongsTo(Usuario, {
  foreignKey: "Usuarios_idUsuarios",
  as: "usuario1",
});

// Relacionamento com a tabela Usuario (do campo Usuarios_idUsuario)
TestDrive.belongsTo(Usuario, {
  foreignKey: "Usuarios_idUsuario",
  as: "usuario2",
});
