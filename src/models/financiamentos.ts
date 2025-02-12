// src/models/financiamentos.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Cliente } from "./clientes"; // Importando o model Cliente
import { Venda } from "./vendas"; // Importando o model Venda

export class Financiamento extends Model {
  public idFinanciamento!: number;
  public Valor_Total!: number;
  public Entrada!: number | null;
  public Parcelas!: number | null;
  public Valor_Parcela!: number | null;
  public Taxa_Juros!: number | null;
  public Data_Inicio!: Date | null;
  public InstituicaoFinanceira!: string | null;
  public Clientes_idCliente!: number;
  public Vendas_idVenda!: number;

}

Financiamento.init(
  {
    idFinanciamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Valor_Total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    Entrada: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    Parcelas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Valor_Parcela: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    Taxa_Juros: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    Data_Inicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    InstituicaoFinanceira: {
      type: DataTypes.STRING(45),
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
    Vendas_idVenda: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Venda, // Relacionamento com a tabela Vendas
        key: "idVenda",
      },
    },
   
  },
  {
    sequelize,
    modelName: "Financiamento",
    tableName: "Financiamentos",
    timestamps: true,
  }
);

// Relacionamentos com Clientes e Vendas
Financiamento.belongsTo(Cliente, {
  foreignKey: "Clientes_idCliente",
  as: "cliente",
});

Financiamento.belongsTo(Venda, {
  foreignKey: "Vendas_idVenda",
  as: "venda",
});
