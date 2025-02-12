// src/controllers/permissoesController.ts
import { Request, Response } from 'express';
import { Permissoes } from '../models/permissoes'; // Modelo de Permissões
import { checkPermission } from '../middlewares/authMiddleware'; // Middleware de permissões

// Função para buscar todas as permissões
export const getPermissoes = [
  checkPermission('Permissoes', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response) => {
    try {
      const permissoes = await Permissoes.findAll();
      res.json(permissoes);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar permissões' });
    }
  },
];

// Função para criar uma nova permissão
export const createPermissao = [
  checkPermission('Permissoes', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { NomeTabela, ler, atualizar, criar, deletar, Usuarios_idUsuario } = req.body;

      // Verificar se a permissão para a tabela e usuário já existe
      const permissaoExistente = await Permissoes.findOne({ where: { NomeTabela, Usuarios_idUsuario } });
      if (permissaoExistente) {
        res.status(400).json({ message: "Permissão já existe para este usuário e tabela." });
        return;
      }

      // Criar a nova permissão
      const permissao = await Permissoes.create({
        NomeTabela,
        ler,
        atualizar,
        criar,
        deletar,
        Usuarios_idUsuario,
      });

      res.status(201).json(permissao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar permissão' });
    }
  },
];

// Função para excluir uma permissão
export const deletePermissao = [
  checkPermission('Permissoes', 'deletar'), // Verifica permissão de deletar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idPermissoes } = req.params;

      const permissao = await Permissoes.findOne({ where: { idPermissoes } });
      if (!permissao) {
        res.status(404).json({ message: 'Permissão não encontrada' });
        return;
      }

      await permissao.destroy();
      res.status(200).json({ message: 'Permissão excluída com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir permissão' });
    }
  },
];

// Função para atualizar uma permissão
export const updatePermissao = [
  checkPermission('Permissoes', 'atualizar'), // Verifica permissão de atualizar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idPermissoes } = req.params;
      const { NomeTabela, ler, atualizar, criar, deletar, Usuarios_idUsuario } = req.body;

      const permissao = await Permissoes.findOne({ where: { idPermissoes } });
      if (!permissao) {
        res.status(404).json({ message: 'Permissão não encontrada' });
        return;
      }

      permissao.NomeTabela = NomeTabela || permissao.NomeTabela;
      permissao.ler = ler !== undefined ? ler : permissao.ler;
      permissao.atualizar = atualizar !== undefined ? atualizar : permissao.atualizar;
      permissao.criar = criar !== undefined ? criar : permissao.criar;
      permissao.deletar = deletar !== undefined ? deletar : permissao.deletar;
      permissao.Usuarios_idUsuario = Usuarios_idUsuario || permissao.Usuarios_idUsuario;

      await permissao.save();
      res.status(200).json(permissao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar permissão' });
    }
  },
];

// Função para buscar permissão por ID
export const getPermissaoById = [
  checkPermission('Permissoes', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idPermissoes } = req.params;
      const permissao = await Permissoes.findByPk(idPermissoes);

      if (!permissao) {
        res.status(404).json({ message: "Permissão não encontrada com este ID." });
        return;
      }

      res.status(200).json(permissao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar permissão pelo ID' });
    }
  },
];
