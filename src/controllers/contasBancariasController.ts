// src/controllers/controllerContaBancarias.ts
import { Request, Response } from 'express';
import { ContaBancaria } from '../models/contasBancarias'; // Modelo de ContaBancaria
import { checkPermission } from '../middlewares/authMiddleware'; // Middleware de permissões
import { Op } from 'sequelize';

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar contas bancárias da empresa do usuário com filtros e paginação
export const getContasBancariasFilter = [
  //checkPermission('ContaBancaria', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      // Pega o ID da empresa do usuário autenticado
      const idEmpresa = req.user?.idempresaToken;

      // Pega os parâmetros da URL (para filtros e paginação)
      const { _page, _limit, nomeBanco_like } = req.query;

      // Converte _page e _limit para inteiros e define valores padrão caso sejam inválidos
      const page = !isNaN(parseInt(_page as string)) ? parseInt(_page as string, 10) : 1;
      const limit = !isNaN(parseInt(_limit as string)) ? parseInt(_limit as string, 10) : 10;
      const offset = (page - 1) * limit;

      // Constrói a condição de filtro para o nome, se fornecido
      const whereCondition = {
        Empresas_idEmpresa: idEmpresa, // Filtro pela empresa do usuário logado
        ...(nomeBanco_like && {
          NomeBanco: {
            [Op.like]: `%${nomeBanco_like}%`, // Filtro por nome do banco (case-insensitive)
          },
        }),
      };

      // Faz a consulta ao banco de dados com paginação e filtro
      const contasBancarias = await ContaBancaria.findAndCountAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
      });

      // Verifica se há contas bancárias e envia a resposta apropriada
      if (contasBancarias.rows.length === 0) {
        res.status(404).json({ message: 'Não há contas bancárias cadastradas na sua empresa.' });
      } else {
        // Envia a lista de contas bancárias com a contagem total, paginação e dados
        res.status(200).json({
          data: contasBancarias.rows,
          totalCount: contasBancarias.count,
          page,
          limit,
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar contas bancárias' });
      console.error(error); // Log do erro para depuração
    }
  },
];

// Função para buscar todas as contas bancárias da empresa do usuário
export const getContasBancarias = [
  //checkPermission('ContaBancaria', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const contasBancarias = await ContaBancaria.findAll({ where: { Empresas_idEmpresa: idEmpresa } });

      if (contasBancarias.length === 0) {
        res.status(404).json({ message: 'Não há contas bancárias cadastradas na sua empresa.' });
      } else {
        res.status(200).json(contasBancarias);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar contas bancárias' });
    }
  },
];

// Função para criar uma nova conta bancária na empresa do usuário
export const createContaBancaria = [
  checkPermission('ContaBancaria', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const {
        NumeroBanco,
        NumeroConta,
        DigitoConta,
        NumeroAgenciaBanco,
        DigitoAgencia,
        NomeBanco,
        TipoConta,
        NomeTitular,
        CPF_CNPJ_Titular,
        StatusConta,
        DataAbertura,
      } = req.body;

      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      // Cria a nova conta bancária
      const contaBancaria = await ContaBancaria.create({
        NumeroBanco,
        NumeroConta,
        DigitoConta,
        NumeroAgenciaBanco,
        DigitoAgencia,
        NomeBanco,
        TipoConta,
        NomeTitular,
        CPF_CNPJ_Titular,
        StatusConta,
        DataAbertura,
        Empresas_idEmpresa: idEmpresa, // Atribui o idEmpresa do usuário logado
      });

      res.status(201).json(contaBancaria);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar conta bancária' });
    }
  },
];

// Função para excluir uma conta bancária da empresa do usuário
export const deleteContaBancaria = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idContasBancarias } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      const contaBancaria = await ContaBancaria.findOne({
        where: { idContasBancarias, Empresas_idEmpresa: idEmpresa },
      });

      if (!contaBancaria) {
        res.status(404).json({
          message: 'Conta bancária não encontrada nesta empresa ou você não tem permissão para excluí-la.',
        });
        return;
      }

      await contaBancaria.destroy();
      res.status(200).json({ message: 'Conta bancária excluída com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir conta bancária' });
    }
  },
];

// Função para atualizar os dados de uma conta bancária na empresa do usuário
export const updateContaBancaria = [
  //checkPermission('ContaBancaria', 'atualizar'), // Verifica permissão de atualização
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idContasBancarias } = req.params;
      const {
        NumeroBanco,
        NumeroConta,
        DigitoConta,
        NumeroAgenciaBanco,
        DigitoAgencia,
        NomeBanco,
        TipoConta,
        NomeTitular,
        CPF_CNPJ_Titular,
        StatusConta,
        DataAbertura,
      } = req.body;

      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado

      const contaBancaria = await ContaBancaria.findOne({
        where: { idContasBancarias, Empresas_idEmpresa: idEmpresa },
      });

      if (!contaBancaria) {
        res.status(404).json({ message: 'Conta bancária não encontrada nesta empresa' });
        return;
      }

      // Atualiza os campos da conta bancária
      contaBancaria.NumeroBanco = NumeroBanco !== undefined ? NumeroBanco : contaBancaria.NumeroBanco;
      contaBancaria.NumeroConta = NumeroConta !== undefined ? NumeroConta : contaBancaria.NumeroConta;
      contaBancaria.DigitoConta = DigitoConta !== undefined ? DigitoConta : contaBancaria.DigitoConta;
      contaBancaria.NumeroAgenciaBanco =
        NumeroAgenciaBanco !== undefined ? NumeroAgenciaBanco : contaBancaria.NumeroAgenciaBanco;
      contaBancaria.DigitoAgencia = DigitoAgencia !== undefined ? DigitoAgencia : contaBancaria.DigitoAgencia;
      contaBancaria.NomeBanco = NomeBanco !== undefined ? NomeBanco : contaBancaria.NomeBanco;
      contaBancaria.TipoConta = TipoConta !== undefined ? TipoConta : contaBancaria.TipoConta;
      contaBancaria.NomeTitular = NomeTitular !== undefined ? NomeTitular : contaBancaria.NomeTitular;
      contaBancaria.CPF_CNPJ_Titular =
        CPF_CNPJ_Titular !== undefined ? CPF_CNPJ_Titular : contaBancaria.CPF_CNPJ_Titular;
      contaBancaria.StatusConta = StatusConta !== undefined ? StatusConta : contaBancaria.StatusConta;
      contaBancaria.DataAbertura = DataAbertura !== undefined ? DataAbertura : contaBancaria.DataAbertura;

      await contaBancaria.save();
      res.status(200).json(contaBancaria);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar conta bancária' });
    }
  },
];

// Função para buscar uma conta bancária por ID na empresa do usuário
export const getContaBancariaById = [
  //checkPermission('ContaBancaria', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idContasBancarias } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const contaBancaria = await ContaBancaria.findOne({
        where: { idContasBancarias, Empresas_idEmpresa: idEmpresa },
            });

      if (!contaBancaria) {
        res.status(404).json({ message: 'Conta bancária não encontrada nesta empresa' });
        return;
      }

      res.status(200).json(contaBancaria);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar conta bancária pelo ID' });
    }
  },
];
