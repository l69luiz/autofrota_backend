//src/controllers/usuariosController.ts
import { Request, Response } from 'express';
import { Usuario } from '../models/usuarios'; // Modelo de Usuário
//import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todos os usuários da empresa do usuário
export const getUsuarios = [
  //checkPermission('Usuarios', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const usuarios = await Usuario.findAll({ where: { Empresas_idEmpresa: idEmpresa } });

      if (usuarios.length === 0) {
        res.status(500).json({ message: 'Não há usuários cadastrados na sua empresa.' });
      } else {
        res.json(usuarios);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários' });
      console.log(error);
    }
  },
];

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
      } = req.body;

      // Verificar se o CPF/CNPJ já existe
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const usuarioExistente = await Usuario.findOne({ where: { CPF_CNPJ, Empresas_idEmpresa: idEmpresa } });
      if (usuarioExistente) {
        res.status(400).json({ message: "CPF/CNPJ já está em uso nesta empresa." });
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
        Empresas_idEmpresa,
        Status: true, // Status padrão como ativo
      });

      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  },
];

// Função para excluir um usuário da empresa do usuário
export const deleteUsuario = [
  //checkPermission('Usuarios', 'deletar'), // Verifica permissão de deletar
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
  //checkPermission('Usuarios', 'atualizar'), // Verifica permissão de atualizar
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
      } = req.body;

      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const usuario = await Usuario.findOne({ where: { idUsuario, Empresas_idEmpresa: idEmpresa } });
      if (!usuario) {
        res.status(404).json({ message: 'Usuário não encontrado nesta empresa' });
        return;
      }

      usuario.Nome = Nome || usuario.Nome;
      usuario.CPF_CNPJ = CPF_CNPJ || usuario.CPF_CNPJ;
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
      usuario.Email = Email || usuario.Email;
      usuario.Senha = Senha || usuario.Senha;
      usuario.Grupo = Grupo || usuario.Grupo;
      usuario.Data_Demissao = Data_Demissao || usuario.Data_Demissao;

      await usuario.save();
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
  },
];

// Função para buscar usuário por CPF/CNPJ na empresa do usuário
export const getUsuarioByCPF_CNPJ = [
  //checkPermission('Usuarios', 'ler'), // Verifica permissão de leitura
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
  //checkPermission('Usuarios', 'ler'), // Verifica permissão de leitura
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

