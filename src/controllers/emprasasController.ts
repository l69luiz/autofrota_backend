// src/controllers/empresasController.ts
import { Request, Response } from 'express';
import { Empresa } from '../models/Empresas'; // Modelo de Empresa
import { Estoque } from '../models/estoques'; // Modelo de Estoque
import { checkPermission } from '../middlewares/authMiddleware'; // Middleware de permissões

// Função para buscar todas as Empresas
export const getEmpresas = [
  //checkPermission('Empresa', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response) => {
    try {
      const empresas = await Empresa.findAll({
        include: [{ model: Estoque, as: 'estoques' }] // Inclui os estoques relacionados
      });
      res.json(empresas);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar empresas' });
      console.log(error);
    }
  },
];

// Função para criar uma nova empresa
export const createEmpresa = [
  checkPermission('Empresa', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { Nome_Empresa, NomeFantasia_Empresa, Endereco_Empresa, Telefone_Empresa, Email_Empresa, CNPJ_Empresa } = req.body;

      // Verificar se o CNPJ já está em uso
      const cnpjExistente = await Empresa.findOne({ where: { CNPJ_Empresa } });
      if (cnpjExistente) {
        res.status(400).json({ message: "CNPJ já está em uso." });
        return;
      }

      // Criar a nova empresa
      const empresa = await Empresa.create({
        Nome_Empresa,
        NomeFantasia_Empresa,
        Endereco_Empresa,
        Telefone_Empresa,
        Email_Empresa,
        CNPJ_Empresa,
      });

      res.status(201).json(empresa);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar empresa' });
    }
  },
];

// Função para excluir uma empresa
export const deleteEmpresa = [
  checkPermission('Empresa', 'deletar'), // Verifica permissão de deletar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idEmpresa } = req.params;

      const empresa = await Empresa.findOne({ where: { idEmpresa } });
      if (!empresa) {
        res.status(404).json({ message: 'Empresa não encontrada' });
        return;
      }

      await empresa.destroy();
      res.status(200).json({ message: 'Empresa excluída com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir empresa' });
    }
  },
];

// Função para atualizar os dados de uma empresa
export const updateEmpresa = [
  checkPermission('Empresa', 'atualizar'), // Verifica permissão de atualizar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idEmpresa } = req.params;
      const { Nome_Empresa, NomeFantasia_Empresa, Endereco_Empresa, Telefone_Empresa, Email_Empresa, CNPJ_Empresa } = req.body;

      const empresa = await Empresa.findOne({ where: { idEmpresa } });
      if (!empresa) {
        res.status(404).json({ message: 'Empresa não encontrada' });
        return;
      }

      empresa.Nome_Empresa = Nome_Empresa || empresa.Nome_Empresa;
      empresa.NomeFantasia_Empresa = Nome_Empresa || empresa.NomeFantasia_Empresa;
      empresa.Endereco_Empresa = Endereco_Empresa || empresa.Endereco_Empresa;
      empresa.Telefone_Empresa = Telefone_Empresa || empresa.Telefone_Empresa;
      empresa.Email_Empresa = Email_Empresa || empresa.Email_Empresa;
      empresa.CNPJ_Empresa = CNPJ_Empresa || empresa.CNPJ_Empresa;

      await empresa.save();
      res.status(200).json(empresa);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar empresa' });
    }
  },
];

// Função para buscar empresa por CNPJ
export const getEmpresaByCNPJ = [
  checkPermission('Empresa', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { CNPJ_Empresa } = req.params;
      const empresa = await Empresa.findOne({ where: { CNPJ_Empresa } });

      if (!empresa) {
        res.status(404).json({ message: "Empresa não encontrada com este CNPJ." });
        return;
      }

      res.status(200).json(empresa);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar empresa pelo CNPJ' });
    }
  },
];

// Função para buscar empresa por ID
export const getEmpresaById = [
  checkPermission('Empresa', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idEmpresa } = req.params;
      const empresa = await Empresa.findByPk(idEmpresa, {
        include: [{ model: Estoque, as: 'estoques' }] // Inclui os estoques relacionados
      });

      if (!empresa) {
        res.status(404).json({ message: "Empresa não encontrada com este ID." });
        return;
      }

      res.status(200).json(empresa);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar empresa pelo ID' });
    }
  },
];
