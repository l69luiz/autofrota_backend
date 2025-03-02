// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Permissoes } from '../models/permissoes';
import { Usuario } from '../models/usuarios';

// Definindo a estrutura do payload do JWT
interface JwtPayload {
  idUserToken: number;
  idempresaToken: number;
  permissoesToken: string[]; // Array de permissões do usuário
}

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Middleware de autenticação para verificar o token
const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Acesso negado!' });
    return;
  }

  try {
    // Decodificar o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Atribuir os dados do token ao campo req.user
    req.user = {
      idUserToken: decoded.idUserToken,
      idempresaToken: decoded.idempresaToken,
      permissoesToken: decoded.permissoesToken,
    };

    next(); // Prossegue para o próximo middleware ou rota
  } catch (error) {
    res.status(400).json({ message: 'Token inválido!' });
    return;
  }
};

// Middleware para verificar permissões antes de permitir o acesso a uma rota
const checkPermission = (nomeTabela: string, acao: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const usuario = req.user;
    const idEmpresaToken = usuario?.idempresaToken;
    const idUsuarioToken = usuario?.idUserToken;
    const idEmpresaURL = Number(req.params.idEmpresa);
    const idUsuarioURL = Number(req.params.idUsuario);

    if (!usuario) {
      res.status(401).json({ message: 'Usuário não autenticado!' });
      return;
    }

    // Verificar se o usuário existe no banco de dados
    const usuarioNoBanco = await Usuario.findOne({ where: { idUsuario: idUsuarioToken } });

    if (!usuarioNoBanco) {
      res.status(404).json({ message: 'Usuário não encontrado no banco de dados.' });
      return;
    }
    if (usuarioNoBanco.Status !== true) {
      res.status(403).json({ message: 'Usuário revogado.' });
      return;
    }

    // Verificar se o usuário está acessando informações de outro usuário
    if (idUsuarioURL && idUsuarioToken !== idUsuarioURL) {
      const dadosUserURL = await Usuario.findOne({ where: { idUsuario: idUsuarioURL } });
      if (!dadosUserURL || idEmpresaToken !== dadosUserURL.Empresas_idEmpresa) {
        if (usuarioNoBanco.Grupo !== 'Administrador') {
          res.status(403).json({ message: 'Usuário não pertence a sua empresa.' });
          return;
        }
      }
    }

    // Verificar se a empresa do token corresponde à empresa da URL
    if (idEmpresaURL && usuarioNoBanco.Empresas_idEmpresa !== idEmpresaURL) {
      if (usuarioNoBanco.Grupo !== 'Administrador') {
        res.status(403).json({ message: 'Verifique a empresa a qual o usuário pertence.' });
        return;
      }
    }

    // Carregar permissões do banco de dados
    const permissoes = await Permissoes.findAll({
      where: {
        Usuarios_idUsuario: idUsuarioToken,
      },
    });

    if (!permissoes || permissoes.length === 0) {
      res.status(403).json({ message: 'Permissão insuficiente para acessar essa tabela.' });
      return;
    }

    // Verifica a permissão de acordo com a ação solicitada
    const permissao = permissoes[0]; // Assumindo que temos no máximo 1 permissão por tabela
    const permissaoNecessaria = permissao[acao as keyof typeof permissao];

    if (permissaoNecessaria) {
      next(); // Permissão concedida, passa para o próximo middleware ou rota
    } else {
      res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
      return;
    }
  };
};

export { authMiddleware, checkPermission };

