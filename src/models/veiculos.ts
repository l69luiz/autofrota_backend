// src/models/veiculos.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Estoque } from "./estoques"; // Import do model Estoque

export class Veiculo extends Model {
  public idVeiculo!: number;
  public Placa_Veiculo!: string | null;
  public Chassi!: string | null;
  public Renavan!: string | null;
  public Cor!: string | null;
  public Nr_Motor!: string | null;
  public Marca!: string | null;
  public Modelo!: string | null;
  public StatusVeiculo!: string | null;
  public Ano_fab!: number | null;
  public Ano_mod!: number | null;
  public Nr_portas!: number | null;
  public CPF_CNPJ_Prop!: string | null;
  public Pot_Motor!: string | null;
  public CaminhoImgVeiculo!: string | null;
  public Km_inicial!: string | null;
  public Ar_cond!: boolean | null;
  public Vidro_elet!: boolean | null;
  public Multimidia!: boolean | null;
  public Sensor_Re!: boolean | null;
  public Vr_PadraoAluguel!: string | null;
  public Trava_Elet!: boolean | null;
  public Alarme!: boolean | null;
  public Valor_Entrada!: number | null;
  public Valor_Fipe_Entrada!: number | null;
  public Estoque_idEstoque!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Veiculo.init(
  {
    idVeiculo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Placa_Veiculo: {
      type: DataTypes.STRING(9),
      allowNull: true,
    },
    Chassi: {
      type: DataTypes.STRING(20),
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
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    StatusVeiculo: {
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
      type: DataTypes.STRING(9),
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
    CaminhoImgVeiculo: {
      type: DataTypes.STRING(120),
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
    Valor_Entrada: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Valor_Fipe_Entrada: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Estoque_idEstoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Estoque, // Relacionamento com a tabela Estoque
        key: "idEstoque",
      },
    },
  },
  {
    sequelize,
    modelName: "Veiculo",
    tableName: "Veiculo", // Nome da tabela no banco de dados
    timestamps: true,
  }
);

// Em veiculo.ts - Relacionamento com Estoque (Um veículo pertence a um estoque)
Veiculo.belongsTo(Estoque, {
  foreignKey: "Estoque_idEstoque",
  as: "estoque",
});


