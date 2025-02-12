// src/controllers/lojasController.ts
import { Request, Response } from 'express';
import { Loja } from '../models/lojas'; // Modelo de Loja
import { Estoque } from '../models/estoques'; // Modelo de Estoque
import { checkPermission } from '../middlewares/authMiddleware'; // Middleware de permissões

// Função para buscar todas as lojas
export const getLojas = [
  //checkPermission('Loja', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response) => {
    try {
      const lojas = await Loja.findAll({
        include: [{ model: Estoque, as: 'estoques' }] // Inclui os estoques relacionados
      });
      res.json(lojas);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar lojas' });
      console.log(error);
    }
  },
];

// Função para criar uma nova loja
export const createLoja = [
  checkPermission('Loja', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { Nome_Loja, Endereco_Loja, Telefone_Loja, Email_Loja, CNPJ_Loja } = req.body;

      // Verificar se o CNPJ já está em uso
      const cnpjExistente = await Loja.findOne({ where: { CNPJ_Loja } });
      if (cnpjExistente) {
        res.status(400).json({ message: "CNPJ já está em uso." });
        return;
      }

      // Criar a nova loja
      const loja = await Loja.create({
        Nome_Loja,
        Endereco_Loja,
        Telefone_Loja,
        Email_Loja,
        CNPJ_Loja,
      });

      res.status(201).json(loja);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar loja' });
    }
  },
];

// Função para excluir uma loja
export const deleteLoja = [
  checkPermission('Loja', 'deletar'), // Verifica permissão de deletar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idLoja } = req.params;

      const loja = await Loja.findOne({ where: { idLoja } });
      if (!loja) {
        res.status(404).json({ message: 'Loja não encontrada' });
        return;
      }

      await loja.destroy();
      res.status(200).json({ message: 'Loja excluída com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir loja' });
    }
  },
];

// Função para atualizar os dados de uma loja
export const updateLoja = [
  checkPermission('Loja', 'atualizar'), // Verifica permissão de atualizar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idLoja } = req.params;
      const { Nome_Loja, Endereco_Loja, Telefone_Loja, Email_Loja, CNPJ_Loja } = req.body;

      const loja = await Loja.findOne({ where: { idLoja } });
      if (!loja) {
        res.status(404).json({ message: 'Loja não encontrada' });
        return;
      }

      loja.Nome_Loja = Nome_Loja || loja.Nome_Loja;
      loja.Endereco_Loja = Endereco_Loja || loja.Endereco_Loja;
      loja.Telefone_Loja = Telefone_Loja || loja.Telefone_Loja;
      loja.Email_Loja = Email_Loja || loja.Email_Loja;
      loja.CNPJ_Loja = CNPJ_Loja || loja.CNPJ_Loja;

      await loja.save();
      res.status(200).json(loja);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar loja' });
    }
  },
];

// Função para buscar loja por CNPJ
export const getLojaByCNPJ = [
  checkPermission('Loja', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { CNPJ_Loja } = req.params;
      const loja = await Loja.findOne({ where: { CNPJ_Loja } });

      if (!loja) {
        res.status(404).json({ message: "Loja não encontrada com este CNPJ." });
        return;
      }

      res.status(200).json(loja);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar loja pelo CNPJ' });
    }
  },
];

// Função para buscar loja por ID
export const getLojaById = [
  checkPermission('Loja', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idLoja } = req.params;
      const loja = await Loja.findByPk(idLoja, {
        include: [{ model: Estoque, as: 'estoques' }] // Inclui os estoques relacionados
      });

      if (!loja) {
        res.status(404).json({ message: "Loja não encontrada com este ID." });
        return;
      }

      res.status(200).json(loja);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar loja pelo ID' });
    }
  },
];
