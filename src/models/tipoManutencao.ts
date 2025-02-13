//src/models/tipoManutencao.ts

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Manutencao } from "./manutencoes"; // Importando o model Manutencao

export class TipoManutencao extends Model {
  public idTipoManutencao!: number;
  public Descricao_Manut!: string;
  public idManutencaoFK!: number;

}

TipoManutencao.init(
  {
    idTipoManutencao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    Descricao_Manut: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    idManutencaoFK: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Manutencao, // Relacionamento com a tabela Manutencao
        key: "idManutencao",
      },
    },
   
  },
  {
    sequelize,
    modelName: "TipoManutencao",
    tableName: "TipoManutencao",
    timestamps: false,
  }
);

// Relacionamento com a tabela Manutencao
TipoManutencao.belongsTo(Manutencao, {
  foreignKey: "idManutencaoFK",
  as: "manutencao", // Alias para o relacionamento
});
