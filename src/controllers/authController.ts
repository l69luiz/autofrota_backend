// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuarios';
import { Permissoes } from '../models/permissoes'; // Model Permissoes

export const login = async (req: Request, res: Response): Promise<void> => {
  const { Email, Senha } = req.body;
  
  try {
    const usuario = await Usuario.findOne({ where: { Email } });

    if (!usuario) {
      res.status(400).json({ message: 'Usuário não encontrado' });
      return;
    }

       if (usuario.Status !== true) {
      res.status(400).json({ message: 'Usuário revogado.' });
      return;
    }

    const senhaValida = await bcrypt.compare(Senha, usuario.Senha);
    if (!senhaValida) {
      res.status(401).json({ message: 'Senha incorreta' });
      return;
    }

    // Obter permissões do usuário diretamente da tabela 'Permissoes'
    const permissoes = await Permissoes.findAll({
      where: { Usuarios_idUsuario: usuario.idUsuario }
    });

    // Criar um objeto para armazenar as permissões por tabela
    const permissoesPorTabela = permissoes.reduce((acc: any, permissao: any) => {
      const tabela = permissao.NomeTabela; // Usar o nome correto da coluna

      if (!acc[tabela]) {
        acc[tabela] = [];
      }

      const permissoesTabela = [];
      if (permissao.ler) permissoesTabela.push('ler');
      if (permissao.atualizar) permissoesTabela.push('atualizar');
      if (permissao.criar) permissoesTabela.push('criar');
      if (permissao.deletar) permissoesTabela.push('deletar');

      acc[tabela] = [...acc[tabela], ...permissoesTabela];
      return acc;
    }, {});

    // Criar o token com as permissões organizadas por tabela
    const token = jwt.sign(
      { 
        idUserToken: usuario.idUsuario, 
        idlojaToken: usuario.Lojas_idLoja, 
        permissoesToken: permissoesPorTabela // Passar as permissões agrupadas por tabela
      },
      process.env.JWT_SECRET!, 
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao autenticar usuário' });
  }
};
