// // src/middlewares/authMiddleware.ts

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// interface JwtPayload {
//   id: number;
// }

// // Estendendo a tipagem do Request diretamente no arquivo
// interface CustomRequest extends Request {
//   user?: {
//     id: number;
//   };
// }

// const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     // Em vez de retornar a resposta, só chamamos `res` para enviar a resposta.
//     res.status(401).json({ message: 'Acesso negado!' });
//     return; // Impede a execução de código posterior
//   }

//   try {
//     // Verificando e decodificando o token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//     req.user = { id: decoded.id }; // Adicionando a propriedade "user" no Request
//     next(); // Prosseguindo com o próximo middleware ou handler
//   } catch (error) {
//     res.status(400).json({ message: 'Token inválido!' });
//     return; // Impede a execução de código posterior
//   }
// };

// //export default authMiddleware;
// export { authMiddleware };

// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface do payload do JWT, agora inclui o grupo e as permissões
interface JwtPayload {
  id: number;
  grupo: string;
  permissoes: string[]; // Array de permissões do usuário
}

// Estendendo a tipagem do Request diretamente no arquivo
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
const checkPermission = (permissaoNecessaria: string) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    const usuario = req.user;

    if (!usuario) {
       res.status(401).json({ message: 'Usuário não autenticado!' });
       return;
    }

    // Verifica se o usuário tem a permissão necessária
    if (usuario.permissoes.includes(permissaoNecessaria)) {
      next(); // Permissão concedida, passa para o próximo middleware ou rota
    } else {
      res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
    }
  };
};

export { authMiddleware, checkPermission };
