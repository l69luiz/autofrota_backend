// src/models/vistorias.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Veiculo } from "./veiculos"; // Importando o model Veiculo
import { Usuario } from "./usuarios"; // Importando o model Usuarios
import { Contrato } from "./contratos"; // Importando o model Contratos

export class Vistoria extends Model {
  public idVistoria!: number;
  public Dt_Vistoria!: Date;
  public Tipo_Vistoria!: string;
  public Retrovisor_Dir!: string;
  public Retrovisor_Esq!: string;
  public Parabrisa!: string;
  public Vidros_Diant_Dir!: string;
  public Vidros_Diant_Esq!: string;
  public Vidros_Tras_Dir!: string;
  public Vidros_Tras_Esq!: string;
  public Vidros_Traseiro!: string;
  public Antena!: string;
  public Farois_Lanternas!: string;
  public Luzes!: string;
  public Parachoque_Tras!: string;
  public ParachoqueDian!: string;
  public Limpadores_Vidro!: string;
  public Painel!: string;
  public Plasticos!: string;
  public Cintos_seg!: string;
  public Chave_Roda_Mac_triangulo!: string;
  public Freio_Servico!: string;
  public Pneus!: string;
  public Rodas!: string;
  public Combustivel!: string;
  public Bancos!: string;
  public Outros!: string;
  public Veiculo_idVeiculo!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public Usuarios_idUsuario!: number;
  public Contratos_idContrato1!: number;
}

Vistoria.init(
  {
    idVistoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    Dt_Vistoria: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Tipo_Vistoria: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Retrovisor_Dir: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Retrovisor_Esq: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Parabrisa: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Vidros_Diant_Dir: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Vidros_Diant_Esq: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Vidros_Tras_Dir: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Vidros_Tras_Esq: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Vidros_Traseiro: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Antena: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Farois_Lanternas: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Luzes: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Parachoque_Tras: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    ParachoqueDian: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Limpadores_Vidro: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Painel: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Plasticos: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Cintos_seg: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Chave_Roda_Mac_triangulo: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Freio_Servico: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Pneus: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Rodas: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Combustivel: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Bancos: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Outros: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Veiculo_idVeiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Veiculo,
        key: "idVeiculo",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Usuarios_idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "idUsuario",
      },
    },
    Contratos_idContrato1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Contrato,
        key: "idContrato",
      },
    },
  },
  {
    sequelize,
    modelName: "Vistoria",
    tableName: "Vistoria",
    timestamps: false,
  }
);

// Relacionamentos com outras tabelas
Vistoria.belongsTo(Veiculo, {
  foreignKey: "Veiculo_idVeiculo",
  as: "veiculo",
});

Vistoria.belongsTo(Usuario, {
  foreignKey: "Usuarios_idUsuario",
  as: "usuario",
});

Vistoria.belongsTo(Contrato, {
  foreignKey: "Contratos_idContrato1",
  as: "contrato",
});
