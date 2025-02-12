// src/models/pagamentos.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Contrato } from "./contratos"; // Importando o model Contrato
import { Venda } from "./vendas"; // Importando o model Venda

export class Pagamento extends Model {
  public idPagamento!: number;
  public Dt_Pagto!: Date | null;
  public Vr_Pagto!: number | null;
  public Forma_Pagto!: string | null;
  public Conta_Creditada!: string | null;
  public idContratoFK!: number;
  public Vendas_idVenda!: number;
}

Pagamento.init(
  {
    idPagamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Dt_Pagto: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Vr_Pagto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Forma_Pagto: {
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
    modelName: "Pagamento",
    tableName: "Pagamento",
    timestamps: true,
  }
);

// Relacionamentos com Contratos e Vendas
Pagamento.belongsTo(Contrato, {
  foreignKey: "idContratoFK",
  as: "contrato",
});

Pagamento.belongsTo(Venda, {
  foreignKey: "Vendas_idVenda",
  as: "venda",
});
