// src/controllers/pagamentosController.ts
import { Request, Response } from 'express';
import { Pagamento } from '../models/pagamentos'; // Modelo de Pagamento
import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todos os pagamentos da loja do usuário
export const getPagamentos = [
  checkPermission('Pagamento', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const pagamentos = await Pagamento.findAll({ where: { Lojas_idLoja: idLoja } });

      if (pagamentos.length === 0) {
        res.status(404).json({ message: 'Não há pagamentos cadastrados na sua loja.' });
      } else {
        res.json(pagamentos);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar pagamentos' });
    }
  },
];

// Função para criar um novo pagamento na loja do usuário
export const createPagamento = [
  checkPermission('Pagamento', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { Dt_Pagto, Vr_Pagto, FormaPagto, ContaDebitada } = req.body;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Criar o novo pagamento
      const pagamento = await Pagamento.create({
        Dt_Pagto,
        Vr_Pagto,
        FormaPagto,
        ContaDebitada,
        Lojas_idLoja: idLoja, // Atribui o idLoja do usuário logado
      });

      res.status(201).json(pagamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar pagamento' });
    }
  },
];

// Função para excluir um pagamento da loja do usuário
export const deletePagamento = [
  checkPermission('Pagamento', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idPagamento } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const pagamento = await Pagamento.findOne({ where: { idPagamento, Lojas_idLoja: idLoja } });
      if (!pagamento) {
        res.status(404).json({ message: 'Pagamento não encontrado nesta loja ou você não tem permissão para excluí-lo.' });
        return;
      }

      await pagamento.destroy();
      res.status(200).json({ message: 'Pagamento excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir pagamento' });
    }
  },
];

// Função para atualizar os dados de um pagamento na loja do usuário
export const updatePagamento = [
  checkPermission('Pagamento', 'atualizar'), // Verifica permissão de atualização
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idPagamento } = req.params;
      const { Dt_Pagto, Vr_Pagto, FormaPagto, ContaDebitada } = req.body;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const pagamento = await Pagamento.findOne({ where: { idPagamento, Lojas_idLoja: idLoja } });
      if (!pagamento) {
        res.status(404).json({ message: 'Pagamento não encontrado nesta loja' });
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

// Função para buscar pagamento por ID na loja do usuário
export const getPagamentoById = [
  checkPermission('Pagamento', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idPagamento } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const pagamento = await Pagamento.findOne({ where: { idPagamento, Lojas_idLoja: idLoja } });
      if (!pagamento) {
        res.status(404).json({ message: 'Pagamento não encontrado nesta loja' });
        return;
      }

      res.status(200).json(pagamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar pagamento pelo ID' });
    }
  },
];
