//src/controllers/entradasController.ts
import { Request, Response } from 'express';
import { Entrada } from '../models/entradas'; // Modelo de Entrada
import { Cliente } from '../models/clientes';
import { Empresa } from '../models/Empresas';
import { ContaBancaria } from '../models/contasBancarias';
import { Contrato } from '../models/contratos';
import { Venda } from '../models/vendas';

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todas as entradas da empresa do usuário
export const getEntradas = [
  // checkPermission('Entrada', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Busca entradas filtrando pela empresa do cliente associado
      const entradas = await Entrada.findAll({
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
          {
            model: ContaBancaria,
            as: 'contaBancaria',
          },
          {
            model: Contrato,
            as: 'contrato',
          },
          {
            model: Venda,
            as: 'venda',
          },
        ],
      });

      // Filtra entradas cujo array de cliente não seja null
      const entradasFiltradas = entradas.filter((entrada: any) => entrada.cliente !== null);

      if (entradasFiltradas.length === 0) {
        res.status(404).json({ message: 'Não há entradas cadastradas na sua empresa.' });
      } else {
        res.json(entradasFiltradas);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar entradas' });
    }
  },
];

// Função para criar uma nova entrada
export const createEntrada = [
  // checkPermission('Entrada', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        Dt_Entrada,
        Vr_Entrada,
        Forma_Entrada,
        Conta_Creditada,
        idContratoFK,
        Vendas_idVenda,
        Clientes_idCliente,
        ContasBancarias_idContasBancarias,
      } = req.body;

      // Criar a nova entrada
      const entrada = await Entrada.create({
        Dt_Entrada,
        Vr_Entrada,
        Forma_Entrada,
        Conta_Creditada,
        idContratoFK,
        Vendas_idVenda,
        Clientes_idCliente,
        ContasBancarias_idContasBancarias,
      });

      res.status(201).json(entrada);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar entrada' });
      console.log(error);
    }
  },
];

// Função para excluir uma entrada da empresa do usuário
export const deleteEntrada = [
  // checkPermission('Entrada', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEntrada } = req.params; // ID da entrada que será excluída
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Busca a entrada, incluindo o cliente e a empresa associada
      const entrada = await Entrada.findOne({
        where: { idEntrada },
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

      // Verifica se a entrada foi encontrada e se o cliente está associado à empresa correta
      if (!entrada || entrada.dataValues.cliente === null) {
        res.status(404).json({ message: 'Entrada não encontrada ou você não tem permissão para excluí-la.' });
        return;
      }

      // Exclui a entrada
      await entrada.destroy();
      res.status(200).json({ message: 'Entrada excluída com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir entrada' });
    }
  },
];

// Função para atualizar os dados de uma entrada da empresa do usuário
export const updateEntrada = [
  // checkPermission('Entrada', 'atualizar'), // Verifica permissão de atualizar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEntrada } = req.params;
      const {
        Dt_Entrada,
        Vr_Entrada,
        Forma_Entrada,
        Conta_Creditada,
        idContratoFK,
        Vendas_idVenda,
        Clientes_idCliente,
        ContasBancarias_idContasBancarias,
      } = req.body;

      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Busca a entrada e verifica se o cliente associado pertence à empresa do usuário
      const entrada = await Entrada.findOne({
        where: { idEntrada },
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

      // Verifica se a entrada foi encontrada e se o cliente pertence à empresa do usuário
      if (!entrada || entrada.dataValues.cliente === null) {
        res.status(404).json({ message: 'Entrada não encontrada ou você não tem permissão para atualizá-la.' });
        return;
      }

      // Atualiza os dados da entrada se fornecidos, ou mantém os existentes
      entrada.Dt_Entrada = Dt_Entrada || entrada.Dt_Entrada;
      entrada.Vr_Entrada = Vr_Entrada || entrada.Vr_Entrada;
      entrada.Forma_Entrada = Forma_Entrada || entrada.Forma_Entrada;
      entrada.Conta_Creditada = Conta_Creditada || entrada.Conta_Creditada;
      entrada.idContratoFK = idContratoFK || entrada.idContratoFK;
      entrada.Vendas_idVenda = Vendas_idVenda || entrada.Vendas_idVenda;
      entrada.Clientes_idCliente = Clientes_idCliente || entrada.Clientes_idCliente;
      entrada.ContasBancarias_idContasBancarias = ContasBancarias_idContasBancarias || entrada.ContasBancarias_idContasBancarias;

      // Salva as alterações
      await entrada.save();
      res.status(200).json(entrada);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar entrada' });
    }
  },
];

// Função para buscar entrada por ID da empresa do usuário
export const getEntradaById = [
  // checkPermission('Entrada', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEntrada } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Busca a entrada pelo ID, garantindo que o cliente esteja associado à empresa do usuário
      const entrada = await Entrada.findOne({
        where: { idEntrada }, // Busca a entrada pelo ID
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

      // Verifica se a entrada foi encontrada e se o cliente pertence à empresa do usuário
      if (!entrada || entrada.dataValues.cliente === null) {
        res.status(404).json({ message: 'Entrada não encontrada ou você não tem permissão para visualizá-la.' });
        return;
      }

      // Retorna a entrada encontrada
      res.status(200).json(entrada);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar entrada pelo ID' });
    }
  },
];
