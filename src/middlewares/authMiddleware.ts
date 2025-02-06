// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Permissoes } from '../models/permissoes'; // Supondo que você tenha um model Permissoes

interface JwtPayload {
  id: number;
  grupo: string;
  permissoes: string[]; // Array de permissões do usuário
}

interface CustomRequest extends Request {
  user?: {
    id: number;
    grupo: string;
    permissoes: string[]; // Array de permissões
  };
}

// Função de autenticação para verificar o token
const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Acesso negado!' });
    return; // Impede a execução de código posterior
  }

  try {
    // Decodificando o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = {
      id: decoded.id,
      grupo: decoded.grupo,
      permissoes: decoded.permissoes, // Armazenando as permissões no Request
    };

    next(); // Prosseguindo com o próximo middleware ou handler
  } catch (error) {
    res.status(400).json({ message: 'Token inválido!' });
    return; // Impede a execução de código posterior
  }
};

// Middleware para verificar permissões antes de permitir o acesso a uma rota
const checkPermission = (nomeTabela: string, acao: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const usuario = req.user;
    
    if (!usuario) {
      res.status(401).json({ message: 'Usuário não autenticado!' });
      return;
    }

    // Carregar as permissões do banco de dados
    const permissoes = await Permissoes.findAll({
      where: {
        Usuarios_idUsuario: usuario.id,
        NomeTabela: nomeTabela
      }
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
    }
  };
};

export { authMiddleware, checkPermission };







// src/middlewares/authMiddleware.ts

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// // Interface do payload do JWT, agora inclui o grupo e as permissões
// interface JwtPayload {
//   id: number;
//   grupo: string;
//   permissoes: string[]; // Array de permissões do usuário
// }

// // Estendendo a tipagem do Request diretamente no arquivo
// interface CustomRequest extends Request {
//   user?: {
//     id: number;
//     grupo: string;
//     permissoes: string[]; // Array de permissões
//   };
// }

// // Função de autenticação para verificar o token
// const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     res.status(401).json({ message: 'Acesso negado!' });
//     return; // Impede a execução de código posterior
//   }

//   try {
//     // Decodificando o token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//     req.user = {
//       id: decoded.id,
//       grupo: decoded.grupo,
//       permissoes: decoded.permissoes, // Armazenando as permissões no Request
      
//     };
    
    
//     next(); // Prosseguindo com o próximo middleware ou handler
//   } catch (error) {
//     res.status(400).json({ message: 'Token inválido!' });
//     return; // Impede a execução de código posterior
//   }
// };

// // Middleware para verificar permissões antes de permitir o acesso a uma rota
// const checkPermission = (permissaoNecessaria: string) => {

//   return (req: CustomRequest, res: Response, next: NextFunction): void => {
//     const usuario = req.user;
    
    
//     if (!usuario) {
//       res.status(401).json({ message: 'Usuário não autenticado!' });
//       return;
//     }

//     // Aqui ajustamos para garantir que a estrutura das permissões seja definida corretamente
//     if (!usuario.permissoes || !Array.isArray(usuario.permissoes)) {
//       res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
//       return;
//     }

//     // Verifica se o usuário tem a permissão necessária
//     if (usuario.permissoes.includes(permissaoNecessaria)) {
      
      
//       // Se o grupo for 'visitante' ou 'userCliente', permitir apenas operações no próprio ID
//       if ((usuario.grupo === 'visitante' || usuario.grupo === 'userCliente') && req.params.idUsuario) {
//         const idUsuario = parseInt(req.params.idUsuario, 10);
        
//         // Verifica se o idUsuario da requisição é igual ao id do usuário autenticado
//         if (usuario.id !== idUsuario) {
//           res.status(403).json({ message: 'Acesso negado. Você só pode acessar seus próprios dados.' });
//           return;
//         }
//       }

//       // Se o grupo tem a permissão necessária ou o id é válido, prosseguir
//       next(); // Permissão concedida, passa para o próximo middleware ou rota
//     } else {
//       res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
//     }
//   };
// };

// export { authMiddleware, checkPermission };
