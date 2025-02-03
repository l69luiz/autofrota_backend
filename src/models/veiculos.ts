// src/models/veiculos.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database"; // Certifique-se de ajustar o caminho de acordo com sua configuração

export class Veiculo extends Model {
  public idVeiculo!: number;
  public Placa_Veiculo!: string;
  public Chassi!: string;
  public Renavan!: string;
  public Cor!: string;
  public Nr_Motor!: string;
  public Marca!: string;
  public Modelo!: string;
  public Ano_fab!: number;
  public Ano_mod!: number;
  public Nr_portas!: number;
  public CPF_CNPJ_Prop!: string;
  public Pot_Motor!: string;
  public Km_inicial!: string;
  public Ar_cond!: boolean;
  public Vidro_elet!: boolean;
  public Multimidia!: boolean;
  public Sensor_Re!: boolean;
  public Vr_PadraoAluguel!: string;
  public Trava_Elet!: boolean;
  public Alarme!: boolean;
}

Veiculo.init(
  {
    idVeiculo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Placa_Veiculo: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    Chassi: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    Renavan: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    Cor: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Nr_Motor: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Marca: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Modelo: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Ano_fab: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Ano_mod: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Nr_portas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CPF_CNPJ_Prop: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    Pot_Motor: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Km_inicial: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    Ar_cond: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Vidro_elet: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Multimidia: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Sensor_Re: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Vr_PadraoAluguel: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Trava_Elet: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Alarme: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Veiculo",
    tableName: "Veiculo",
    timestamps: false,
  }
);
