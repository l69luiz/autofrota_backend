//src/models/entradas.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Contrato } from "./contratos";
import { Venda } from "./vendas";
import { Cliente } from "./clientes";
import { ContaBancaria } from "./contasBancarias";

export class Entrada extends Model {
  public idEntrada!: number;
  public Dt_Entrada!: Date | null;
  public Vr_Entrada!: number | null;
  public Forma_Entrada!: string | null;
  public Conta_Creditada!: string | null;
  public idContratoFK!: number | null;
  public Vendas_idVenda!: number | null;
  public Clientes_idCliente!: number | null;
  public ContasBancarias_idContasBancarias!: number;
}

Entrada.init(
  {
    idEntrada: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Dt_Entrada: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Vr_Entrada: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Forma_Entrada: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Conta_Creditada: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    idContratoFK: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Contrato, // Relacionamento com a tabela Contratos
        key: "idContrato",
      },
    },
    Vendas_idVenda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Venda, // Relacionamento com a tabela Vendas
        key: "idVenda",
      },
    },
    Clientes_idCliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Cliente, // Relacionamento com a tabela Clientes
        key: "idCliente",
      },
    },
    ContasBancarias_idContasBancarias: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ContaBancaria, // Relacionamento com a tabela ContasBancarias
        key: "idContasBancarias",
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

// Relacionamentos com Contrato, Venda, Cliente e ContasBancarias
Entrada.belongsTo(Contrato, {
  foreignKey: "idContratoFK",
  as: "contrato",
});

Entrada.belongsTo(Venda, {
  foreignKey: "Vendas_idVenda",
  as: "venda",
});

Entrada.belongsTo(Cliente, {
  foreignKey: "Clientes_idCliente",
  as: "cliente",
});

Entrada.belongsTo(ContaBancaria, {
  foreignKey: "ContasBancarias_idContasBancarias",
  as: "contaBancaria",
});


