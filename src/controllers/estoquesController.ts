// src/controllers/estoquesController.ts 
import { Request, Response } from 'express';
import { Estoque } from '../models/estoques'; // Modelo de Estoque
import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todos os estoques da loja do usuário
export const getEstoques = [
  checkPermission('Estoque', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const estoques = await Estoque.findAll({ where: { Lojas_idLoja: idLoja } });

      if (estoques.length === 0) {
        res.status(404).json({ message: 'Não há estoques cadastrados na sua loja.' });
      } else {
        res.json(estoques);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar estoques' });
    }
  },
];

// Função para criar um novo estoque na loja do usuário
export const createEstoque = [
  checkPermission('Estoque', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { Quantidade, Data_Entrada, Status, Local, Nome } = req.body;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Criar o novo estoque
      const estoque = await Estoque.create({
        Quantidade,
        Data_Entrada,
        Status,
        Lojas_idLoja: idLoja, // Atribui o idLoja do usuário logado
        Local,
        Nome,
      });

      res.status(201).json(estoque);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar estoque' });
    }
  },
];

// Função para excluir um estoque da loja do usuário
export const deleteEstoque = [
  checkPermission('Estoque', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEstoque } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const estoque = await Estoque.findOne({ where: { idEstoque, Lojas_idLoja: idLoja } });
      if (!estoque) {
        res.status(404).json({ message: 'Estoque não encontrado nesta loja ou você não tem permissão para excluí-lo.' });
        return;
      }

      await estoque.destroy();
      res.status(200).json({ message: 'Estoque excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir estoque' });
    }
  },
];

// Função para atualizar os dados de um estoque na loja do usuário
export const updateEstoque = [
  checkPermission('Estoque', 'atualizar'), // Verifica permissão de atualização
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEstoque } = req.params;
      const { Quantidade, Data_Entrada, Status, Local, Nome } = req.body;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const estoque = await Estoque.findOne({ where: { idEstoque, Lojas_idLoja: idLoja } });
      if (!estoque) {
        res.status(404).json({ message: 'Estoque não encontrado nesta loja' });
        return;
      }

      estoque.Quantidade = Quantidade !== undefined ? Quantidade : estoque.Quantidade;
      estoque.Data_Entrada = Data_Entrada !== undefined ? Data_Entrada : estoque.Data_Entrada;
      estoque.Status = Status !== undefined ? Status : estoque.Status;
      estoque.Local = Local !== undefined ? Local : estoque.Local;
      estoque.Nome = Nome !== undefined ? Nome : estoque.Nome;

      await estoque.save();
      res.status(200).json(estoque);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar estoque' });
    }
  },
];

// Função para buscar estoque por ID na loja do usuário
export const getEstoqueById = [
  checkPermission('Estoque', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEstoque } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const estoque = await Estoque.findOne({ where: { idEstoque, Lojas_idLoja: idLoja } });
      if (!estoque) {
        res.status(404).json({ message: 'Estoque não encontrado nesta loja' });
        return;
      }

      res.status(200).json(estoque);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar estoque pelo ID' });
    }
  },
];

