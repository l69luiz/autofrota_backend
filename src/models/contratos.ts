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
  Vr_Diario: number;
  Contratocol: string;
  Veiculo_idVeiculo: number;
  Usuarios_idUsuario: number;
}

export class Contrato extends Model {
  public idContrato!: number;
  public Dt_inicial!: Date;
  public Dt_Final!: Date;
  public Vr_Semanal!: number;
  public Vr_Diario!: number;
  public Veiculo_idVeiculo!: number;
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
    Vr_Diario: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
   
    Veiculo_idVeiculo: {
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

// Em contratos.ts - Relacionamentos contrato
Contrato.belongsTo(Usuario, 
  { foreignKey: 'Usuarios_idUsuario',
    as: "usuario",
   });
Contrato.belongsTo(Veiculo,
   { foreignKey: 'Veiculo_idVeiculo',
    as: "veiculo",
    });



