// src/controllers/usuariosController.ts

import { Request, Response } from 'express';
import { Usuario } from '../models/usuarios'; // Modelo de Usuario
import { Op } from 'sequelize';

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todos os usuários da empresa com filtros
export const getUsuariosFilter = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Pega o ID da empresa do usuário autenticado
    const idEmpresa = req.user?.idempresaToken;

    // Pega os parâmetros da URL (para filtros e paginação)
    const { _page, _limit, nome_like } = req.query;

    // Converte _page e _limit para inteiros e define valores padrão caso sejam inválidos
    const page = !isNaN(parseInt(_page as string)) ? parseInt(_page as string, 10) : 1;
    const limit = !isNaN(parseInt(_limit as string)) ? parseInt(_limit as string, 10) : 10;
    const offset = (page - 1) * limit;

    // Constrói a condição de filtro para o nome completo, se fornecido
    const whereCondition = {
      Empresas_idEmpresa: idEmpresa, // Filtro pela empresa do usuário logado
      ...(nome_like && {
        Nome: {
          [Op.like]: `%${nome_like}%`,
        },
      }),
    };

    // Faz a consulta ao banco de dados com paginação e filtro
    const usuarios = await Usuario.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
    });

    // Verifica se há usuários e envia a resposta apropriada
    if (usuarios.rows.length === 0) {
      res.status(404).json({ message: 'Não há usuários cadastrados na sua empresa.' });
    } else {
      // Envia a lista de usuários com a contagem total, paginação e dados
      res.status(200).json({
        data: usuarios.rows,
        totalCount: usuarios.count,
        page,
        limit,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
    //console.log(error);
  }
};

// Função para criar um novo usuário na empresa do usuário
export const createUsuario = [
  //checkPermission('Usuarios', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const {
        Nome,
        CPF_CNPJ,
        Rua,
        Numero,
        Bairro,
        Cidade,
        Celular,
        Celular2,
        RG,
        Tipo,
        Cargo,
        Salario,
        Data_Admissao,
        Email,
        Senha,
        Grupo,
        Data_Demissao,
        Status
      } = req.body;

      // Verificar se o CPF/CNPJ já existe
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const usuarioExistenteCPF_CNPJ = await Usuario.findOne({ where: { CPF_CNPJ, Empresas_idEmpresa: idEmpresa } });
      if (usuarioExistenteCPF_CNPJ) {
        res.status(400).json({ message: "CPF/CNPJ já está em uso nesta empresa." });
        return;
      }
      // Verificar se o Email já existe
      const usuarioExistenteEmail = await Usuario.findOne({ where: { Email, Empresas_idEmpresa: idEmpresa } });
      if (usuarioExistenteEmail) {
        res.status(400).json({ message: "Email já está em uso nesta empresa." });
        return;
      }

      // Criar o novo usuário
      const Empresas_idEmpresa = idEmpresa;
      const usuario = await Usuario.create({
        Nome,
        CPF_CNPJ,
        Rua,
        Numero,
        Bairro,
        Cidade,
        Celular,
        Celular2,
        RG,
        Tipo,
        Cargo,
        Salario,
        Data_Admissao,
        Email,
        Senha,
        Grupo,
        Data_Demissao,
        Empresas_idEmpresa,
        Status
      });

      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar registro' });
    }
  },
];

// Função para excluir um usuário da empresa do usuário
export const deleteUsuario = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idUsuario } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
       const usuario = await Usuario.findOne({ where: { idUsuario, Empresas_idEmpresa: idEmpresa } });
      if (!usuario) {
        res.status(404).json({ message: 'Usuário não encontrado nesta empresa' });
        return;
      }

      await usuario.destroy();
      res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir usuário' });
    }
  },
];

// Função para atualizar os dados de um usuário na empresa do usuário
export const updateUsuario = [
   async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idUsuario } = req.params;
      const {
        Nome,
        CPF_CNPJ,
        Rua,
        Numero,
        Bairro,
        Cidade,
        Celular,
        Celular2,
        RG,
        Tipo,
        Cargo,
        Salario,
        Data_Admissao,
        Email,
        Senha,
        Grupo,
        Data_Demissao,
        Status
      } = req.body;

      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const usuario = await Usuario.findOne({ where: { idUsuario, Empresas_idEmpresa: idEmpresa } });
      if (!usuario) {
        res.status(404).json({ message: 'Usuário não encontrado nesta empresa' });
        return;
      }

    // Verificar se o e-mail foi alterado
    if (Email && Email !== usuario.Email) {
      // Verificar se o novo e-mail já está em uso em outra conta na mesma empresa
      const usuarioExistenteEmail = await Usuario.findOne({
        where: {
          Email,
          Empresas_idEmpresa: idEmpresa,
          idUsuario: { [Op.ne]: idUsuario }, // Exclui o usuário atual da verificação
        },
      });

      if (usuarioExistenteEmail) {
        res.status(400).json({ message: "O novo e-mail já está em uso nesta empresa." });
        return;
      }

      // Atualizar o e-mail se não estiver em uso
      usuario.Email = Email;
    }

    // Verificar se o CPF_CNPJ foi alterado
    if (CPF_CNPJ && CPF_CNPJ !== usuario.CPF_CNPJ) {
      // Verificar se o novo CPF_CNPJ já está em uso em outra conta na mesma empresa
      const usuarioExistenteCPF_CNPJ = await Usuario.findOne({
        where: {
          CPF_CNPJ,
          Empresas_idEmpresa: idEmpresa,
          idUsuario: { [Op.ne]: idUsuario }, // Exclui o usuário atual da verificação
        },
      });

      if (usuarioExistenteCPF_CNPJ) {
        res.status(400).json({ message: "O novo CPF ou CNPJ já está em uso nesta empresa." });
        return;
      }

      // Atualizar o e-mail se não estiver em uso
      usuario.CPF_CNPJ = CPF_CNPJ;
    }

      usuario.Nome = Nome || usuario.Nome;
      usuario.Rua = Rua || usuario.Rua;
      usuario.Numero = Numero || usuario.Numero;
      usuario.Bairro = Bairro || usuario.Bairro;
      usuario.Cidade = Cidade || usuario.Cidade;
      usuario.Celular = Celular || usuario.Celular;
      usuario.Celular2 = Celular2 || usuario.Celular2;
      usuario.RG = RG || usuario.RG;
      usuario.Tipo = Tipo || usuario.Tipo;
      usuario.Cargo = Cargo || usuario.Cargo;
      usuario.Salario = Salario || usuario.Salario;
      usuario.Data_Admissao = Data_Admissao || usuario.Data_Admissao;
      usuario.Senha = Senha || usuario.Senha;
      usuario.Grupo = Grupo || usuario.Grupo;
      usuario.Data_Demissao = Data_Demissao || usuario.Data_Demissao;
      usuario.Status = Status || usuario.Status;
      await usuario.save();
        res.status(200).json({ message: 'Registro atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar registro.' });
    }
  },
];

// Função para buscar usuário por CPF/CNPJ na empresa do usuário
export const getUsuarioByCPF_CNPJ = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { CPF_CNPJ } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const usuario = await Usuario.findOne({ where: { CPF_CNPJ, Empresas_idEmpresa: idEmpresa } });
      if (!usuario) {
        res.status(404).json({ message: "Usuário não encontrado com este CPF/CNPJ nesta empresa." });
        return;
      }
        res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuário pelo CPF/CNPJ' });
    }
  },
];

// Função para buscar usuário por ID na empresa do usuário
export const getUsuarioById = [
   async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idUsuario } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const usuario = await Usuario.findOne({ where: { idUsuario, Empresas_idEmpresa: idEmpresa } });
      if (!usuario) {
        res.status(404).json({ message: "Usuário não encontrado com este ID nesta empresa." });
        return;
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuário pelo ID' });
    }
  },
];