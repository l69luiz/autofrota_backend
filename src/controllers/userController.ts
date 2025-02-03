// src/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Usuario } from '../models/usuarios';

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};


export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { Nome, CPF_CNPJ, Email, Senha, ...rest } = req.body;

    // Verificar se o email já existe
    const emailExistente = await Usuario.findOne({ where: { Email } });
    if (emailExistente) {
      res.status(400).json({ message: "O e-mail já está em uso." });
      return; // Finaliza a função sem retornar nada
    }

    // Verificar se o CPF/CNPJ já existe
    const cpfCnpjExistente = await Usuario.findOne({ where: { CPF_CNPJ } });
    if (cpfCnpjExistente) {
      res.status(400).json({ message: "O CPF/CNPJ já está em uso." });
      return; // Finaliza a função sem retornar nada
    }

    // Criptografar a senha
    const hashedSenha = await bcrypt.hash(Senha, 10);

    // Criar o novo usuário
    const usuario = await Usuario.create({ Nome, CPF_CNPJ, Email, Senha: hashedSenha, ...rest });

    // Retornar resposta de sucesso
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};


// Função para excluir um usuário
export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idUsuario } = req.params;

    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ where: { idUsuario } });
    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    // Excluir o usuário
    await usuario.destroy();
    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
};


// Função para atualizar os dados do usuário
export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
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
      Email, 
      Senha, 
      Grupo 
    } = req.body;

    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ where: { idUsuario } });
    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    // Verificar se o e-mail já está em uso por outro usuário
    if (Email && Email !== usuario.Email) {
      const emailExistente = await Usuario.findOne({ where: { Email } });
      if (emailExistente) {
        res.status(400).json({ message: "O e-mail já está em uso." });
        return;
      }
    }

    // Verificar se o CPF/CNPJ já está em uso por outro usuário
    if (CPF_CNPJ && CPF_CNPJ !== usuario.CPF_CNPJ) {
      const cpfCnpjExistente = await Usuario.findOne({ where: { CPF_CNPJ } });
      if (cpfCnpjExistente) {
        res.status(400).json({ message: "O CPF/CNPJ já está em uso." });
        return;
      }
    }

    // Atualizar os dados do usuário
    if (Senha) {
      const hashedSenha = await bcrypt.hash(Senha, 10);
      usuario.Senha = hashedSenha; // Atualiza a senha
    }

    // Atualizar os outros campos
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
    usuario.Email = Email || usuario.Email;
    usuario.Grupo = Grupo || usuario.Grupo;

    // Salvar as alterações
    await usuario.save();

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

// Buscar usuário por CPF_CNPJ
export const getUsuarioByCpfCnpj = async (req: Request, res: Response): Promise<void> => {
  try {
    const { CPF_CNPJ } = req.params;
    const usuario = await Usuario.findOne({ where: { CPF_CNPJ } });

    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado com este CPF/CNPJ." });
      return;
    }

    // Remover a senha do objeto antes de retornar a resposta
    const { Senha, ...usuarioSemSenha } = usuario.toJSON(); // Desestruturando para remover a senha

    res.status(200).json(usuarioSemSenha); // Retorna o usuário sem a senha
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário pelo CPF/CNPJ' });
  }
};



// Buscar usuário por Email
export const getUsuarioByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { Email } = req.params;
    const usuario = await Usuario.findOne({ where: { Email } });

    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado com este Email." });
      return;
    }

    // Remover a senha do objeto antes de retornar a resposta
    const { Senha, ...usuarioSemSenha } = usuario.toJSON(); // Desestruturando para remover a senha

    res.status(200).json(usuarioSemSenha); // Retorna o usuário sem a senha
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário pelo Email' });
  }
};


// Buscar usuário por ID - Não retorna senha
export const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idUsuario } = req.params;
    const usuario = await Usuario.findByPk(idUsuario);

    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado com este ID." });
      return;
    }

    // Remover a senha do objeto antes de retornar a resposta
    const { Senha, ...usuarioSemSenha } = usuario.toJSON(); // Desestruturando para remover a senha

    res.status(200).json(usuarioSemSenha); // Retorna o usuário sem a senha
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário pelo ID' });
  }
};
