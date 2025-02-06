// src/models/permissoes.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Usuario } from "./usuarios"; // Importando o model Usuario

export class Permissoes extends Model {
  public idPermissoes!: number;
  public NomeTabela!: string | null;
  public ler!: boolean | null;
  public atualizar!: boolean | null;
  public criar!: boolean | null;
  public deletar!: boolean | null;
  public Usuarios_idUsuario!: number;
}

Permissoes.init(
  {
    idPermissoes: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    NomeTabela: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    ler: {
      type: DataTypes.BOOLEAN,  // Usando BOOLEAN para representar TINYINT(1)
      allowNull: true,
    },
    atualizar: {
      type: DataTypes.BOOLEAN,  // Usando BOOLEAN para representar TINYINT(1)
      allowNull: true,
    },
    criar: {
      type: DataTypes.BOOLEAN,  // Usando BOOLEAN para representar TINYINT(1)
      allowNull: true,
    },
    deletar: {
      type: DataTypes.BOOLEAN,  // Usando BOOLEAN para representar TINYINT(1)
      allowNull: true,
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
    modelName: "Permissoes",
    tableName: "Permissoes",
    timestamps: true,
  }
);

// Relacionamento com a tabela Usuarios
Permissoes.belongsTo(Usuario, {
  foreignKey: "Usuarios_idUsuario",
  as: "usuario",
});
