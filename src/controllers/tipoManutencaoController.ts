import { Request, Response } from 'express';
import { TipoManutencao } from '../models/tipoManutencao'; // Modelo de TipoManutencao
import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

// Função para buscar todos os tipos de manutenção
export const getTipoManutencao = [
  checkPermission('TipoManutencao', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const tiposManutencao = await TipoManutencao.findAll();
      res.json(tiposManutencao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar tipos de manutenção' });
    }
  },
];

// Função para criar um novo tipo de manutenção
export const createTipoManutencao = [
  checkPermission('TipoManutencao', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { Descricao_Manut, idManutencaoFK } = req.body;

      // Criar o novo tipo de manutenção
      const tipoManutencao = await TipoManutencao.create({
        Descricao_Manut,
        idManutencaoFK,
      });

      res.status(201).json(tipoManutencao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar tipo de manutenção' });
    }
  },
];

// Função para excluir um tipo de manutenção
export const deleteTipoManutencao = [
  checkPermission('TipoManutencao', 'deletar'), // Verifica permissão de deletar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idTipoManutencao } = req.params;

      const tipoManutencao = await TipoManutencao.findOne({ where: { idTipoManutencao } });
      if (!tipoManutencao) {
        res.status(404).json({ message: 'Tipo de manutenção não encontrado' });
        return;
      }

      await tipoManutencao.destroy();
      res.status(200).json({ message: 'Tipo de manutenção excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir tipo de manutenção' });
    }
  },
];

// Função para atualizar os dados de um tipo de manutenção
export const updateTipoManutencao = [
  checkPermission('TipoManutencao', 'atualizar'), // Verifica permissão de atualizar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idTipoManutencao } = req.params;
      const { Descricao_Manut, idManutencaoFK } = req.body;

      const tipoManutencao = await TipoManutencao.findOne({ where: { idTipoManutencao } });
      if (!tipoManutencao) {
        res.status(404).json({ message: 'Tipo de manutenção não encontrado' });
        return;
      }

      tipoManutencao.Descricao_Manut = Descricao_Manut || tipoManutencao.Descricao_Manut;
      tipoManutencao.idManutencaoFK = idManutencaoFK || tipoManutencao.idManutencaoFK;

      await tipoManutencao.save();
      res.status(200).json(tipoManutencao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar tipo de manutenção' });
    }
  },
];

// Função para buscar tipo de manutenção por ID
export const getTipoManutencaoById = [
  checkPermission('TipoManutencao', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idTipoManutencao } = req.params;
      const tipoManutencao = await TipoManutencao.findByPk(idTipoManutencao);

      if (!tipoManutencao) {
        res.status(404).json({ message: "Tipo de manutenção não encontrado com este ID." });
        return;
      }

      res.status(200).json(tipoManutencao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar tipo de manutenção pelo ID' });
    }
  },
];
