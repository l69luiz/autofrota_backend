//src/controllers/financiamentosController.ts
import { Request, Response } from 'express';
import { Financiamento } from '../models/financiamentos'; // Modelo de Financiamento
import { Cliente } from '../models/clientes';
import { Empresa } from '../models/Empresas';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { GET_FINANCIAMENTOS_BY_EMPRESA } from '../consultasSQL/consultasFinanciamentos';


interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todos os financiamentos da empresa do usuário
export const getFinanciamentos = [
  //checkPermission('Financiamento', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Executa a query SQL diretamente
      const financiamentos = await sequelize.query(GET_FINANCIAMENTOS_BY_EMPRESA,
        {
          replacements: { idEmpresa: idEmpresa }, // Substitui o parâmetro pelo idEmpresa do usuário
          type: QueryTypes.SELECT // Define o tipo de query
        }
      );

      // Verifica se encontrou algum financiamento
      if (financiamentos.length === 0) {
        res.status(404).json({ message: 'Não há financiamentos cadastrados na sua empresa.' });
      } else {
        res.json(financiamentos);
      }
    } catch (error) {
      console.error('Erro ao buscar financiamentos:', error);
      res.status(500).json({ message: 'Erro ao buscar financiamentos' });
    }
  },
];



// Função para criar um novo financiamento
export const createFinanciamento = [
  //checkPermission('Financiamento', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        Valor_Total,
        Entrada,
        Parcelas,
        Valor_Parcela,
        Taxa_Juros,
        Data_Inicio,
        InstituicaoFinanceira,
        Clientes_idCliente,
        Vendas_idVenda
      } = req.body;

      // Criar o novo financiamento
      const financiamento = await Financiamento.create({
        Valor_Total,
        Entrada,
        Parcelas,
        Valor_Parcela,
        Taxa_Juros,
        Data_Inicio,
        InstituicaoFinanceira,
        Clientes_idCliente,
        Vendas_idVenda
      });

      res.status(201).json(financiamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar financiamento' });
      console.log(error);
    }
  },
];

// Função para excluir um financiamento da empresa do usuário
export const deleteFinanciamento = [
  //checkPermission('Financiamento', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idFinanciamento } = req.params; // ID do financiamento que será excluído
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Busca o financiamento, incluindo o cliente e a empresa associada
      const financiamento = await Financiamento.findOne({
        where: { idFinanciamento },
        include: [
          {
            model: Cliente,
            as: 'cliente',
            include: [
              {
                model: Empresa,
                as: 'empresa',
                where: { idEmpresa: idEmpresa }, // Filtra pela empresa do cliente
              },
            ],
          },
        ],
      });

      // Verifica se o financiamento foi encontrado e se o cliente está associado à empresa correta
      if (!financiamento || financiamento.dataValues.cliente === null) {
        res.status(404).json({ message: 'Financiamento não encontrado ou você não tem permissão para excluí-lo.' });
        return;
      }

      // Exclui o financiamento
      await financiamento.destroy();
      res.status(200).json({ message: 'Financiamento excluído com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir financiamento' });
    }
  },
];


// Função para atualizar os dados de um financiamento da empresa do usuário
export const updateFinanciamento = [
  //checkPermission('Financiamento', 'atualizar'), // Verifica permissão de atualizar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idFinanciamento } = req.params;
      const {
        Valor_Total,
        Entrada,
        Parcelas,
        Valor_Parcela,
        Taxa_Juros,
        Data_Inicio,
        InstituicaoFinanceira,
        Clientes_idCliente,
        Vendas_idVenda
      } = req.body;

      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Busca o financiamento e verifica se o cliente associado pertence à empresa do usuário
      const financiamento = await Financiamento.findOne({
        where: { idFinanciamento },
        include: [
          {
            model: Cliente,
            as: 'cliente',
            include: [
              {
                model: Empresa,
                as: 'empresa',
                where: { idEmpresa: idEmpresa }, // Filtra pela empresa do cliente
              },
            ],
          },
        ],
      });

      // Verifica se o financiamento foi encontrado e se o cliente pertence à empresa do usuário
      if (!financiamento || financiamento.dataValues.cliente === null) {
        res.status(404).json({ message: 'Financiamento não encontrado ou você não tem permissão para atualizá-lo.' });
        return;
      }

      // Atualiza os dados do financiamento se fornecidos, ou mantém os existentes
      financiamento.Valor_Total = Valor_Total || financiamento.Valor_Total;
      financiamento.Entrada = Entrada || financiamento.Entrada;
      financiamento.Parcelas = Parcelas || financiamento.Parcelas;
      financiamento.Valor_Parcela = Valor_Parcela || financiamento.Valor_Parcela;
      financiamento.Taxa_Juros = Taxa_Juros || financiamento.Taxa_Juros;
      financiamento.Data_Inicio = Data_Inicio || financiamento.Data_Inicio;
      financiamento.InstituicaoFinanceira = InstituicaoFinanceira || financiamento.InstituicaoFinanceira;
      financiamento.Clientes_idCliente = Clientes_idCliente || financiamento.Clientes_idCliente;
      financiamento.Vendas_idVenda = Vendas_idVenda || financiamento.Vendas_idVenda;

      // Salva as alterações
      await financiamento.save();
      res.status(200).json(financiamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar financiamento' });
    }
  },
];


// Função para buscar financiamento por ID da empresa do usuário
export const getFinanciamentoById = [
  //checkPermission('Financiamento', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idFinanciamento } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Busca o financiamento pelo ID, garantindo que o cliente esteja associado à empresa do usuário
      const financiamento = await Financiamento.findOne({
        where: { idFinanciamento }, // Busca o financiamento pelo ID
        include: [
          {
            model: Cliente,
            as: 'cliente', // Alias usado no relacionamento
            include: [
              {
                model: Empresa,
                as: 'empresa', // Alias usado no relacionamento
                where: { idEmpresa: idEmpresa }, // Filtra pela empresa do cliente
              },
            ],
          },
        ],
      });

      // Verifica se o financiamento foi encontrado e se o cliente pertence à empresa do usuário
      if (!financiamento || financiamento.dataValues.cliente === null) {
        res.status(404).json({ message: 'Financiamento não encontrado ou você não tem permissão para visualizá-lo.' });
        return;
      }

      // Retorna o financiamento encontrado
      res.status(200).json(financiamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar financiamento pelo ID' });
    }
  },
];
