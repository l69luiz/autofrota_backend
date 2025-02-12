// src/controllers/pagamentosController.ts
import { Request, Response } from 'express';
import { Pagamento } from '../models/pagamentos'; // Modelo de Pagamento
import { checkPermission } from '../middlewares/authMiddleware'; // Middleware de permissões

// Função para buscar todos os pagamentos
export const getPagamentos = [
  checkPermission('Pagamento', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response) => {
    try {
      const pagamentos = await Pagamento.findAll();
      res.json(pagamentos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar pagamentos' });
    }
  },
];

// Função para criar um novo pagamento
export const createPagamento = [
  checkPermission('Pagamento', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        Dt_Pagto,
        Vr_Pagto,
        Forma_Pagto,
        Conta_Creditada,
        idContratoFK,
        Vendas_idVenda
      } = req.body;

      // Criar o novo pagamento
      const pagamento = await Pagamento.create({
        Dt_Pagto,
        Vr_Pagto,
        Forma_Pagto,
        Conta_Creditada,
        idContratoFK,
        Vendas_idVenda
      });

      res.status(201).json(pagamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar pagamento' });
    }
  },
];

// Função para excluir um pagamento
export const deletePagamento = [
  checkPermission('Pagamento', 'deletar'), // Verifica permissão de deletar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idPagamento } = req.params;

      const pagamento = await Pagamento.findOne({ where: { idPagamento } });
      if (!pagamento) {
        res.status(404).json({ message: 'Pagamento não encontrado' });
        return;
      }

      await pagamento.destroy();
      res.status(200).json({ message: 'Pagamento excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir pagamento' });
    }
  },
];

// Função para atualizar os dados de um pagamento
export const updatePagamento = [
  checkPermission('Pagamento', 'atualizar'), // Verifica permissão de atualizar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idPagamento } = req.params;
      const {
        Dt_Pagto,
        Vr_Pagto,
        Forma_Pagto,
        Conta_Creditada,
        idContratoFK,
        Vendas_idVenda
      } = req.body;

      const pagamento = await Pagamento.findOne({ where: { idPagamento } });
      if (!pagamento) {
        res.status(404).json({ message: 'Pagamento não encontrado' });
        return;
      }

      pagamento.Dt_Pagto = Dt_Pagto || pagamento.Dt_Pagto;
      pagamento.Vr_Pagto = Vr_Pagto || pagamento.Vr_Pagto;
      pagamento.Forma_Pagto = Forma_Pagto || pagamento.Forma_Pagto;
      pagamento.Conta_Creditada = Conta_Creditada || pagamento.Conta_Creditada;
      pagamento.idContratoFK = idContratoFK || pagamento.idContratoFK;
      pagamento.Vendas_idVenda = Vendas_idVenda || pagamento.Vendas_idVenda;

      await pagamento.save();
      res.status(200).json(pagamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar pagamento' });
    }
  },
];

// Função para buscar pagamento por ID
export const getPagamentoById = [
  checkPermission('Pagamento', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idPagamento } = req.params;
      const pagamento = await Pagamento.findByPk(idPagamento);

      if (!pagamento) {
        res.status(404).json({ message: "Pagamento não encontrado com este ID." });
        return;
      }

      res.status(200).json(pagamento);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar pagamento pelo ID' });
    }
  },
];
