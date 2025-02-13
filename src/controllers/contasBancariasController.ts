// src/controllers/controllerContaBancarios.ts
import { Request, Response } from 'express';
import { ContaBancaria } from '../models/contasBancarias'; // Modelo de ContaBancaria
import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todas as contas bancárias da loja do usuário
export const getContasBancarias = [
  checkPermission('ContaBancaria', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const contasBancarias = await ContaBancaria.findAll({ where: { Lojas_idLoja: idLoja } });

      if (contasBancarias.length === 0) {
        res.status(404).json({ message: 'Não há contas bancárias cadastradas na sua loja.' });
      } else {
        res.json(contasBancarias);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar contas bancárias' });
    }
  },
];

// Função para criar uma nova conta bancária na loja do usuário
export const createContaBancaria = [
  checkPermission('ContaBancaria', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { NumeroBanco, NumeroConta, DigitoConta, NumeroAgenciaBanco, DigitoAgencia, NomeBanco, TipoConta, NomeTitular, CPF_CNPJ_Titular, StatusConta, DataAbertura } = req.body;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Criar a nova conta bancária
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
        Lojas_idLoja: idLoja, // Atribui o idLoja do usuário logado
      });

      res.status(201).json(contaBancaria);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar conta bancária' });
    }
  },
];

// Função para excluir uma conta bancária da loja do usuário
export const deleteContaBancaria = [
  checkPermission('ContaBancaria', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idContasBancarias } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const contaBancaria = await ContaBancaria.findOne({ where: { idContasBancarias, Lojas_idLoja: idLoja } });
      if (!contaBancaria) {
        res.status(404).json({ message: 'Conta bancária não encontrada nesta loja ou você não tem permissão para excluí-la.' });
        return;
      }

      await contaBancaria.destroy();
      res.status(200).json({ message: 'Conta bancária excluída com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir conta bancária' });
    }
  },
];

// Função para atualizar os dados de uma conta bancária na loja do usuário
export const updateContaBancaria = [
  checkPermission('ContaBancaria', 'atualizar'), // Verifica permissão de atualização
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idContasBancarias } = req.params;
      const { NumeroBanco, NumeroConta, DigitoConta, NumeroAgenciaBanco, DigitoAgencia, NomeBanco, TipoConta, NomeTitular, CPF_CNPJ_Titular, StatusConta, DataAbertura } = req.body;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const contaBancaria = await ContaBancaria.findOne({ where: { idContasBancarias, Lojas_idLoja: idLoja } });
      if (!contaBancaria) {
        res.status(404).json({ message: 'Conta bancária não encontrada nesta loja' });
        return;
      }

      contaBancaria.NumeroBanco = NumeroBanco !== undefined ? NumeroBanco : contaBancaria.NumeroBanco;
      contaBancaria.NumeroConta = NumeroConta !== undefined ? NumeroConta : contaBancaria.NumeroConta;
      contaBancaria.DigitoConta = DigitoConta !== undefined ? DigitoConta : contaBancaria.DigitoConta;
      contaBancaria.NumeroAgenciaBanco = NumeroAgenciaBanco !== undefined ? NumeroAgenciaBanco : contaBancaria.NumeroAgenciaBanco;
      contaBancaria.DigitoAgencia = DigitoAgencia !== undefined ? DigitoAgencia : contaBancaria.DigitoAgencia;
      contaBancaria.NomeBanco = NomeBanco !== undefined ? NomeBanco : contaBancaria.NomeBanco;
      contaBancaria.TipoConta = TipoConta !== undefined ? TipoConta : contaBancaria.TipoConta;
      contaBancaria.NomeTitular = NomeTitular !== undefined ? NomeTitular : contaBancaria.NomeTitular;
      contaBancaria.CPF_CNPJ_Titular = CPF_CNPJ_Titular !== undefined ? CPF_CNPJ_Titular : contaBancaria.CPF_CNPJ_Titular;
      contaBancaria.StatusConta = StatusConta !== undefined ? StatusConta : contaBancaria.StatusConta;
      contaBancaria.DataAbertura = DataAbertura !== undefined ? DataAbertura : contaBancaria.DataAbertura;

      await contaBancaria.save();
      res.status(200).json(contaBancaria);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar conta bancária' });
    }
  },
];

// Função para buscar conta bancária por ID na loja do usuário
export const getContaBancariaById = [
  checkPermission('ContaBancaria', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idContasBancarias } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const contaBancaria = await ContaBancaria.findOne({ where: { idContasBancarias, Lojas_idLoja: idLoja } });
      if (!contaBancaria) {
        res.status(404).json({ message: 'Conta bancária não encontrada nesta loja' });
        return;
      }

      res.status(200).json(contaBancaria);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar conta bancária pelo ID' });
    }
  },
];
