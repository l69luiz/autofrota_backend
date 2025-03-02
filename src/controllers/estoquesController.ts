// src/controllers/estoquesController.ts 
import { Request, Response } from 'express';
import { Estoque } from '../models/estoques'; // Modelo de Estoque
import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões
import { Op } from 'sequelize';

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}


// Função para buscar estoques da empresa do usuário com filtros e paginação
export const getEstoquesFilter = [
  checkPermission('Estoque', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      // Pega o ID da empresa do usuário autenticado
      const idEmpresa = req.user?.idempresaToken;

      // Pega os parâmetros da URL (para filtros e paginação)
      const { _page, _limit, nome_like } = req.query;

      // Converte _page e _limit para inteiros e define valores padrão caso sejam inválidos
      const page = !isNaN(parseInt(_page as string)) ? parseInt(_page as string, 10) : 1;
      const limit = !isNaN(parseInt(_limit as string)) ? parseInt(_limit as string, 10) : 10;
      const offset = (page - 1) * limit;

      // Constrói a condição de filtro para o nome, se fornecido
      const whereCondition = {
        Empresas_idEmpresa: idEmpresa, // Filtro pela empresa do usuário logado
        ...(nome_like && {
          Nome: {
            [Op.like]: `%${nome_like}%`, // Filtro por nome (case-insensitive)
          },
        }),
      };

      // Faz a consulta ao banco de dados com paginação e filtro
      const estoques = await Estoque.findAndCountAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
      });

      // Verifica se há estoques e envia a resposta apropriada
      if (estoques.rows.length === 0) {
        res.status(404).json({ message: 'Não há estoques cadastrados na sua empresa.' });
      } else {
        // Envia a lista de estoques com a contagem total, paginação e dados
        res.status(200).json({
          data: estoques.rows,
          totalCount: estoques.count,
          page,
          limit,
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar estoques' });
      console.error(error); // Log do erro para depuração
    }
  },
];



// Função para buscar todos os estoques da empresa do usuário
export const getEstoques = [
  checkPermission('Estoque', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const estoques = await Estoque.findAll({ where: { Empresas_idEmpresa: idEmpresa } });

      if (estoques.length === 0) {
        res.status(404).json({ message: 'Não há estoques cadastrados na sua empresa.' });
      } else {
        res.json(estoques);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar estoques' });
    }
  },
];

// Função para criar um novo estoque na empresa do usuário
export const createEstoque = [
  checkPermission('Estoque', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { AreaTotal, AreaCoberta, Data_Abertura, Status, Local, Nome } = req.body;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Criar o novo estoque
      const estoque = await Estoque.create({
        AreaTotal,
        AreaCoberta,
        Data_Abertura,
        Status,
        Empresas_idEmpresa: idEmpresa, // Atribui o idEmpresa do usuário logado
        Local,
        Nome,
      });

      res.status(201).json(estoque);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar estoque' });
    }
  },
];

// Função para excluir um estoque da empresa do usuário
export const deleteEstoque = [
  checkPermission('Estoque', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEstoque } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      const estoque = await Estoque.findOne({ where: { idEstoque, Empresas_idEmpresa: idEmpresa } });
      if (!estoque) {
        res.status(404).json({ message: 'Estoque não encontrado nesta empresa ou você não tem permissão para excluí-lo.' });
        return;
      }

      await estoque.destroy();
      res.status(200).json({ message: 'Estoque excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir estoque' });
    }
  },
];

// Função para atualizar os dados de um estoque na empresa do usuário
export const updateEstoque = [
  checkPermission('Estoque', 'atualizar'), // Verifica permissão de atualização
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEstoque } = req.params;
      const { AreaTotal, AreaCoberta, Data_Abertura, Status, Local, Nome } = req.body;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      const estoque = await Estoque.findOne({ where: { idEstoque, Empresas_idEmpresa: idEmpresa } });
      if (!estoque) {
        res.status(404).json({ message: 'Estoque não encontrado nesta empresa' });
        return;
      }

      estoque.AreaTotal = AreaCoberta !== undefined ? AreaCoberta : estoque.AreaCoberta;
      estoque.AreaTotal = AreaTotal !== undefined ? AreaTotal : estoque.AreaTotal;
      estoque.Data_Abertura = Data_Abertura !== undefined ? Data_Abertura : estoque.Data_Abertura;
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

// Função para buscar estoque por ID na empresa do usuário
export const getEstoqueById = [
  checkPermission('Estoque', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEstoque } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      const estoque = await Estoque.findOne({ where: { idEstoque, Empresas_idEmpresa: idEmpresa } });
      if (!estoque) {
        res.status(404).json({ message: 'Estoque não encontrado nesta empresa' });
        return;
      }

      res.status(200).json(estoque);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar estoque pelo ID' });
    }
  },
];

