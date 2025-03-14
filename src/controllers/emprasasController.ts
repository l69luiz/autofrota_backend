// src/controllers/empresasController.ts

import { Request, Response } from 'express';
import { Empresa } from '../models/Empresas'; // Modelo de Empresa
import { Op } from 'sequelize';

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todas as empresas com filtros
export const getEmpresasFilter = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Pega o ID da empresa do usuário autenticado
    const idEmpresa = req.user?.idempresaToken;
    console.log("IdEmpresaX: ", idEmpresa);

    // Pega os parâmetros da URL (para filtros e paginação)
    const { _page, _limit, nomeEmpresa_like } = req.query;


    // Converte _page e _limit para inteiros e define valores padrão caso sejam inválidos
    const page = !isNaN(parseInt(_page as string)) ? parseInt(_page as string, 10) : 1;
    const limit = !isNaN(parseInt(_limit as string)) ? parseInt(_limit as string, 10) : 10;
    const offset = (page - 1) * limit;

    // Constrói a condição de filtro para o nome da empresa, se fornecido
    const whereCondition = {
      idEmpresa: idEmpresa, // Filtro pela empresa do usuário logado
      ...(nomeEmpresa_like && {
        Nome_Empresa: {
          [Op.like]: `%${nomeEmpresa_like}%`,
        },
      }),
    };

    // Faz a consulta ao banco de dados com paginação e filtro
    const empresas = await Empresa.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
    });

    // Verifica se há empresas e envia a resposta apropriada
    if (empresas.rows.length === 0) {
      res.status(404).json({ message: 'Não há empresas cadastradas.' });
    } else {
      // Envia a lista de empresas com a contagem total, paginação e dados
      res.status(200).json({
        data: empresas.rows,
        totalCount: empresas.count,
        page,
        limit,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao buscar empresas.' });
  }
};

// Função para criar uma nova empresa
export const createEmpresa = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const {
        Nome_Empresa,
        NomeFantasia_Empresa,
        Endereco_Empresa,
        Telefone_Empresa,
        Email_Empresa,
        CNPJ_Empresa,
        CaminhoImgEmpresa,
      } = req.body;

      // Verificar se o CNPJ já existe
      const empresaExistenteCNPJ = await Empresa.findOne({ where: { CNPJ_Empresa } });
      if (empresaExistenteCNPJ) {
        res.status(400).json({ message: "CNPJ já está em uso." });
        return;
      }

      // Verificar se o Email já existe
      const empresaExistenteEmail = await Empresa.findOne({ where: { Email_Empresa } });
      if (empresaExistenteEmail) {
        res.status(400).json({ message: "Email já está em uso." });
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
        CaminhoImgEmpresa,
      });

      res.status(201).json(empresa);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erro ao criar registro' });
    }
  },
];

// Função para excluir uma empresa
export const deleteEmpresa = [
  async (req: CustomRequest, res: Response): Promise<void> => {
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
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEmpresa } = req.params;
      const {
        Nome_Empresa,
        NomeFantasia_Empresa,
        Endereco_Empresa,
        Telefone_Empresa,
        Email_Empresa,
        CNPJ_Empresa,
        CaminhoImgEmpresa,
      } = req.body;

      const empresa = await Empresa.findOne({ where: { idEmpresa } });
      if (!empresa) {
        res.status(404).json({ message: 'Empresa não encontrada' });
        return;
      }

      // Verificar se o e-mail foi alterado
      if (Email_Empresa && Email_Empresa !== empresa.Email_Empresa) {
        const empresaExistenteEmail = await Empresa.findOne({
          where: {
            Email_Empresa,
            idEmpresa: { [Op.ne]: idEmpresa }, // Exclui a empresa atual da verificação
          },
        });

        if (empresaExistenteEmail) {
          res.status(400).json({ message: "O novo e-mail já está em uso." });
          return;
        }

        empresa.Email_Empresa = Email_Empresa;
      }

      // Verificar se o CNPJ foi alterado
      if (CNPJ_Empresa && CNPJ_Empresa !== empresa.CNPJ_Empresa) {
        const empresaExistenteCNPJ = await Empresa.findOne({
          where: {
            CNPJ_Empresa,
            idEmpresa: { [Op.ne]: idEmpresa }, // Exclui a empresa atual da verificação
          },
        });

        if (empresaExistenteCNPJ) {
          res.status(400).json({ message: "O novo CNPJ já está em uso." });
          return;
        }

        empresa.CNPJ_Empresa = CNPJ_Empresa;
      }

      empresa.Nome_Empresa = Nome_Empresa || empresa.Nome_Empresa;
      empresa.NomeFantasia_Empresa = NomeFantasia_Empresa || empresa.NomeFantasia_Empresa;
      empresa.Endereco_Empresa = Endereco_Empresa || empresa.Endereco_Empresa;
      empresa.Telefone_Empresa = Telefone_Empresa || empresa.Telefone_Empresa;
      empresa.CaminhoImgEmpresa = CaminhoImgEmpresa || empresa.CaminhoImgEmpresa;
      await empresa.save();

      res.status(200).json({ message: 'Registro atualizado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar registro.' });
    }
  },
];

// Função para buscar empresa por CNPJ
export const getEmpresaByCNPJ = [
  async (req: CustomRequest, res: Response): Promise<void> => {
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
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idEmpresa } = req.params;
      const empresa = await Empresa.findOne({ where: { idEmpresa } });
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