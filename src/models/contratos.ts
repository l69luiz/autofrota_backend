// src/models/contratos.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Usuario } from './usuarios';
import { Veiculo } from './veiculos';

interface ContratoAttributes {
  idContrato: number;
  Dt_inicial: Date;
  Dt_Final: Date;
  Vr_Semanal: number;
  vR_Diario: number;
  Contratocol: string;
  idVeiculoFK: number;
  Usuarios_idUsuario: number;
}

export class Contrato extends Model<ContratoAttributes> implements ContratoAttributes {
  public idContrato!: number;
  public Dt_inicial!: Date;
  public Dt_Final!: Date;
  public Vr_Semanal!: number;
  public vR_Diario!: number;
  public Contratocol!: string;
  public idVeiculoFK!: number;
  public Usuarios_idUsuario!: number;
}

Contrato.init(
  {
    idContrato: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    Dt_inicial: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Dt_Final: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Vr_Semanal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    vR_Diario: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Contratocol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idVeiculoFK: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    Usuarios_idUsuario: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Contratos',
  }
);

// Relacionamentos
Contrato.belongsTo(Usuario, { foreignKey: 'Usuarios_idUsuario' });
Contrato.belongsTo(Veiculo, { foreignKey: 'idVeiculoFK' });
