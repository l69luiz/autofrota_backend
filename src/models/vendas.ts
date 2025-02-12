// src/models/vendas.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Cliente } from "./clientes"; // Importando o model Cliente
import { Usuario } from "./usuarios"; // Importando o model Usuario
import { Veiculo } from "./veiculos"; // Importando o model Veiculo

export class Venda extends Model {
  public idVenda!: number;
  public Data_Venda!: Date;
  public Valor_Venda!: number;
  public Margem_Minima!: number | null;
  public Desconto_Venda!: number | null;
  public Forma_Pagamento!: string | null;
  public Clientes_idCliente!: number;
  public Usuarios_idUsuario!: number;
  public Veiculo_idVeiculo!: number;
  public createdAt!: Date;
  public updateAt!: Date;
}

Venda.init(
  {
    idVenda: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Data_Venda: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Valor_Venda: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    Margem_Minima: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 5.00,
    },
    Desconto_Venda: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    Forma_Pagamento: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Clientes_idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cliente, // Relacionamento com a tabela Clientes
        key: "idCliente",
      },
    },
    Usuarios_idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario, // Relacionamento com a tabela Usuarios
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Venda",
    tableName: "Vendas",
    timestamps: true,
  }
);

// Relacionamentos com Clientes, Usuarios e Veiculo
Venda.belongsTo(Cliente, {
  foreignKey: "Clientes_idCliente",
  as: "cliente",
});

Venda.belongsTo(Usuario, {
  foreignKey: "Usuarios_idUsuario",
  as: "usuario",
});

Venda.belongsTo(Veiculo, {
  foreignKey: "Veiculo_idVeiculo",
  as: "veiculo",
});
