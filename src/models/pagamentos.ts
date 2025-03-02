//src/models/pagamentos.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Empresa } from './Empresas';

export class Pagamento extends Model {
  public idPagamento!: number;
  public Dt_Pagto!: Date | null;
  public Vr_Pagto!: number | null;
  public FormaPagto!: string | null;
  public Empresas_idEmpresa!: number;
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
    Empresas_idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Empresa,
        key: 'idEmpresa',
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

// Relacionamento com a tabela Empresas usando alias
Pagamento.belongsTo(Empresa,
   { foreignKey: 'Empresas_idEmpresa',
     as: 'empresa' 
   });
Empresa.hasMany(Pagamento,
   { foreignKey: 'Empresas_idEmpresa', 
    as: 'pagamento' 
   });
