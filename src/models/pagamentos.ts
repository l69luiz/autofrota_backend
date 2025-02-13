//src/models/pagamentos.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Loja } from './lojas';

export class Pagamento extends Model {
  public idPagamento!: number;
  public Dt_Pagto!: Date | null;
  public Vr_Pagto!: number | null;
  public FormaPagto!: string | null;
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
    FormaPagto: {
      type: DataTypes.STRING(45),
      allowNull: true,
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
    timestamps: true,
  }
);

// Relacionamento com a tabela Lojas usando alias
Pagamento.belongsTo(Loja,
   { foreignKey: 'Lojas_idLoja',
     as: 'loja' 
   });
Loja.hasMany(Pagamento,
   { foreignKey: 'Lojas_idLoja', 
    as: 'pagamento' 
   });
