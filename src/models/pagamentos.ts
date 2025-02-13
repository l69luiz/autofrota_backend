// src/models/pagamentos.ts

import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../config/database";
import { Loja } from './lojas'; // model da tabela Lojas

export class Pagamento extends Model {
  public idPagamento!: number;
  public Dt_Pagto!: Date | null;
  public Vr_Pagto!: number | null;
  public Forma_Pagto!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
  public Lojas_idLoja!: number;
  public ContaDebitada!: number | null;
}

Pagamento.init(
  {
    idPagamento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Lojas_idLoja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Loja,
        key: 'idLoja',
      },
    },
    ContaDebitada: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Pagamento',
    tableName: 'Pagamentos',
  }
);

// Relacionamento com Lojas
Pagamento.belongsTo(Loja, { 
  foreignKey: 'Lojas_idLoja',
  as: "loja",
});



