//src/controllers/usuariosController.ts
import { Request, Response } from 'express';
import { Usuario } from '../models/usuarios'; // Modelo de Usuário
//import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todos os usuários da loja do usuário
export const getUsuarios = [
  //checkPermission('Usuarios', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const usuarios = await Usuario.findAll({ where: { Lojas_idLoja: idLoja } });

      if (usuarios.length === 0) {
        res.status(500).json({ message: 'Não há usuários cadastrados na sua loja.' });
      } else {
        res.json(usuarios);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários' });
      console.log(error);
    }
  },
];

// Função para criar um novo usuário na loja do usuário
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
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const usuarioExistente = await Usuario.findOne({ where: { CPF_CNPJ, Lojas_idLoja: idLoja } });
      if (usuarioExistente) {
        res.status(400).json({ message: "CPF/CNPJ já está em uso nesta loja." });
        return;
      }

      // Criar o novo usuário
      const Lojas_idLoja = idLoja;
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
        Lojas_idLoja,
        Status: true, // Status padrão como ativo
      });

      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  },
];

// Função para excluir um usuário da loja do usuário
export const deleteUsuario = [
  //checkPermission('Usuarios', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idUsuario } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const usuario = await Usuario.findOne({ where: { idUsuario, Lojas_idLoja: idLoja } });
      if (!usuario) {
        res.status(404).json({ message: 'Usuário não encontrado nesta loja' });
        return;
      }

      await usuario.destroy();
      res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir usuário' });
    }
  },
];

// Função para atualizar os dados de um usuário na loja do usuário
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

      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const usuario = await Usuario.findOne({ where: { idUsuario, Lojas_idLoja: idLoja } });
      if (!usuario) {
        res.status(404).json({ message: 'Usuário não encontrado nesta loja' });
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

// Função para buscar usuário por CPF/CNPJ na loja do usuário
export const getUsuarioByCPF_CNPJ = [
  //checkPermission('Usuarios', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { CPF_CNPJ } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const usuario = await Usuario.findOne({ where: { CPF_CNPJ, Lojas_idLoja: idLoja } });

      if (!usuario) {
        res.status(404).json({ message: "Usuário não encontrado com este CPF/CNPJ nesta loja." });
        return;
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuário pelo CPF/CNPJ' });
    }
  },
];

// Função para buscar usuário por ID na loja do usuário
export const getUsuarioById = [
  //checkPermission('Usuarios', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idUsuario } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const usuario = await Usuario.findOne({ where: { idUsuario, Lojas_idLoja: idLoja } });

      if (!usuario) {
        res.status(404).json({ message: "Usuário não encontrado com este ID nesta loja." });
        return;
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuário pelo ID' });
    }
  },
];

