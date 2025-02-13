//src/models/contasBancarias.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Loja } from './lojas';

export class ContaBancaria extends Model {
  public idContasBancarias!: number;
  public NumeroBanco!: string;
  public NumeroConta!: string;
  public DigitoConta!: string | null;
  public NumeroAgenciaBanco!: string | null;
  public DigitoAgencia!: string | null;
  public NomeBanco!: string | null;
  public TipoConta!: string | null;
  public NomeTitular!: string | null;
  public CPF_CNPJ_Titular!: string | null;
  public StatusConta!: string | null;
  public DataAbertura!: Date | null;
  public Lojas_idLoja!: number;

}

ContaBancaria.init(
  {
    idContasBancarias: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    NumeroBanco: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    NumeroConta: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    DigitoConta: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    NumeroAgenciaBanco: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    DigitoAgencia: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    NomeBanco: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    TipoConta: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    NomeTitular: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CPF_CNPJ_Titular: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    StatusConta: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    DataAbertura: {
      type: DataTypes.DATE,
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
  },
  {
    sequelize,
    modelName: 'ContaBancaria',
    tableName: 'ContasBancarias',
    timestamps: true,
  }
);

// Relacionamento com a tabela Lojas usando alias
ContaBancaria.belongsTo(Loja,
     { foreignKey: 'Lojas_idLoja',
       as: 'loja' 
    });

Loja.hasMany(ContaBancaria,
     { foreignKey: 'Lojas_idLoja',
       as: 'contasBancarias' 
    });
