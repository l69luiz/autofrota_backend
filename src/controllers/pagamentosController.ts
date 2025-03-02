// src/controllers/pagamentosController.ts
import { Request, Response } from 'express';
import { Pagamento } from '../models/pagamentos'; // Modelo de Pagamento
import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todos os pagamentos da empresa do usuário
export const getPagamentos = [
  checkPermission('Pagamento', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const pagamentos = await Pagamento.findAll({ where: { Empresas_idEmpresa: idEmpresa } });

      if (pagamentos.length === 0) {
        res.status(404).json({ message: 'Não há pagamentos cadastrados na sua empresa.' });
      } else {
        res.json(pagamentos);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar pagamentos' });
    }
  },
];

// Função para criar um novo pagamento na empresa do usuário
export const createPagamento = [
  checkPermission('Pagamento', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { Dt_Pagto, Vr_Pagto, FormaPagto, ContaDebitada } = req.body;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Criar o novo pagamento
      const pagamento = await Pagamento.create({
        Dt_Pagto,
        Vr_Pagto,
        FormaPagto,
        ContaDebitada,
        Empresas_idEmpresa: idEmpresa, // Atribui o idEmpresa do usuário logado
      });

      res.status(201).json(pagamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar pagamento' });
    }
  },
];

// Função para excluir um pagamento da empresa do usuário
export const deletePagamento = [
  checkPermission('Pagamento', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idPagamento } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      const pagamento = await Pagamento.findOne({ where: { idPagamento, Empresas_idEmpresa: idEmpresa } });
      if (!pagamento) {
        res.status(404).json({ message: 'Pagamento não encontrado nesta empresa ou você não tem permissão para excluí-lo.' });
        return;
      }

      await pagamento.destroy();
      res.status(200).json({ message: 'Pagamento excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir pagamento' });
    }
  },
];

// Função para atualizar os dados de um pagamento na empresa do usuário
export const updatePagamento = [
  checkPermission('Pagamento', 'atualizar'), // Verifica permissão de atualização
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idPagamento } = req.params;
      const { Dt_Pagto, Vr_Pagto, FormaPagto, ContaDebitada } = req.body;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      const pagamento = await Pagamento.findOne({ where: { idPagamento, Empresas_idEmpresa: idEmpresa } });
      if (!pagamento) {
        res.status(404).json({ message: 'Pagamento não encontrado nesta empresa' });
        return;
      }

      pagamento.Dt_Pagto = Dt_Pagto !== undefined ? Dt_Pagto : pagamento.Dt_Pagto;
      pagamento.Vr_Pagto = Vr_Pagto !== undefined ? Vr_Pagto : pagamento.Vr_Pagto;
      pagamento.FormaPagto = FormaPagto !== undefined ? FormaPagto : pagamento.FormaPagto;
      pagamento.ContaDebitada = ContaDebitada !== undefined ? ContaDebitada : pagamento.ContaDebitada;

      await pagamento.save();
      res.status(200).json(pagamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar pagamento' });
    }
  },
];

// Função para buscar pagamento por ID na empresa do usuário
export const getPagamentoById = [
  checkPermission('Pagamento', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idPagamento } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      const pagamento = await Pagamento.findOne({ where: { idPagamento, Empresas_idEmpresa: idEmpresa } });
      if (!pagamento) {
        res.status(404).json({ message: 'Pagamento não encontrado nesta empresa' });
        return;
      }

      res.status(200).json(pagamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar pagamento pelo ID' });
    }
  },
];
