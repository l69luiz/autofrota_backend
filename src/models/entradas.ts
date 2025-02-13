// src/models/recebimentos.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Contrato } from "./contratos"; // Importando o model Contrato
import { Venda } from "./vendas"; // Importando o model Venda.

export class Entrada extends Model {
  public i!: number;
  public Dt_Entrada!: Date | null;
  public Vr_Entrada!: number | null;
  public Forma_Entrada!: string | null;
  public Conta_Creditada!: string | null;
  public idContratoFK!: number;
  public Vendas_idVenda!: number;
}

Entrada.init(
  {
    idEntrada: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Dt_Entrada: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Vr_Entrada: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Forma_Entrada: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Conta_Creditada: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    idContratoFK: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Contrato, // Relacionamento com a tabela Contrato
        key: "idContrato",
      },
    },

    Vendas_idVenda: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Venda, // Relacionamento com a tabela Venda
        key: "idVenda",
      },
    },
  },
  {
    sequelize,
    modelName: "Entrada",
    tableName: "Entradas",
    timestamps: true,
  }
);

// Relacionamentos com Contratos e Vendas
Entrada.belongsTo(Contrato, {
  foreignKey: "idContratoFK",
  as: "contrato",
});

Entrada.belongsTo(Venda, {
  foreignKey: "Vendas_idVenda",
  as: "venda",
});
