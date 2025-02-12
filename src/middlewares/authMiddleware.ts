// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Permissoes } from '../models/permissoes';
import { Usuario } from '../models/usuarios';

// Definindo a estrutura do payload do JWT
interface JwtPayload {
  idUserToken: number;
  idlojaToken: number;
  permissoesToken: string[]; // Array de permissões do usuário
}

// // Definindo a estrutura do user
// interface user {
//   idUserToken: number;
//   idlojaToken: number;
//   permissoesToken: string[]; // Array de permissões do usuário
// }

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
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
      idlojaToken: decoded.idlojaToken,
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
    const idLojaToken = usuario?.idlojaToken;
    const idUsuarioToken = usuario?.idUserToken;
    const idLojaURL = Number(req.params.idLoja);
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
      if (!dadosUserURL || idLojaToken !== dadosUserURL.Lojas_idLoja) {
        if (usuarioNoBanco.Grupo !== 'Administrador') {
          res.status(403).json({ message: 'Usuário não pertence a sua loja.' });
          return;
        }
      }
    }

    // Verificar se a loja do token corresponde à loja da URL
    if (idLojaURL && usuarioNoBanco.Lojas_idLoja !== idLojaURL) {
      if (usuarioNoBanco.Grupo !== 'Administrador') {
        res.status(403).json({ message: 'Verifique a loja a qual o usuário pertence.' });
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



// // src/middlewares/authMiddleware.ts
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { Permissoes } from '../models/permissoes'; // Supondo que você tenha um model Permissoes
// import { Usuario } from '../models/usuarios';



// interface JwtPayload {
//   id: number;
//   loja: string;
//   permissoes: string[]; // Array de permissões do usuário
// }

// interface CustomRequest extends Request {
//   user?: {
//     id: number;
//     loja: string;
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
//       loja: decoded.loja,
//       permissoes: decoded.permissoes, // Armazenando as permissões no Request
//     };

//     next(); // Prosseguindo com o próximo middleware ou handler
//   } catch (error) {
//     res.status(400).json({ message: 'Token inválido!' });
//     return; // Impede a execução de código posterior
//   }
// };

// // Middleware para verificar permissões antes de permitir o acesso a uma rota
// const checkPermission = (nomeTabela: string, acao: string) => {

//   return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {


//     //Req user é do token  e req.params é da url da rota
//     const usuario = req.user; // Pegando os dados do Usuario do Token
//     const idLojaToken = Number(req.user?.loja); // Obter o id da loja do Token
//     const idUsuarioToken = Number(req.user?.id); // Obter o idUsuario do Token
//     const idLojaURL = Number(req.params.idLoja); // Obter o idLoja da URL
//     const idUsuarioURL = Number(req.params.idUsuario); // Obter o idUsuario da URL
    
    


//     if (!usuario) {
//       res.status(401).json({ message: 'Usuário não autenticado!' });
//       return;
//     }

//     // Verificar se o usuário está no banco de dados
//     const usuarioNoBanco = await Usuario.findOne({ where: { idUsuario: idUsuarioToken } });
    



//     if (!usuarioNoBanco) {
//       res.status(404).json({ message: 'Usuário não encontrado no banco de dados.' });
//       return;
//     }
//     if (usuarioNoBanco.Status !== true) {
//       res.status(404).json({ message: 'Usuário revogado.' });
//       return;
//     }
    
//     // Rota Usuário - Verificar se o Usuario é Gerente para fazer alteração em outros usuário se não no seu proprio
//     if (idUsuarioURL && idUsuarioToken !== idUsuarioURL) {
//       //Carrega os dados do usuário da URL
//       const dadosUserURL = await Usuario.findOne({ where: { idUsuario: idUsuarioURL } });
//       if (!dadosUserURL) {
//         res.status(404).json({ message: 'Usuário não encontrado no banco de dados.' });
//         return;
//       }
      

//       if (idLojaToken !== dadosUserURL?.Lojas_idLoja ) {
//         if (usuarioNoBanco.Grupo === 'Administrador'){
//           //console.log("Está no Then do Adminsitrador");

//         }else{
//           res.status(403).json({ message: 'Usuário não pertence a sua Loja. Entre em contato com um Gerente da Loja para acessar esse usuário.' });
//         return;
//         }
        
        
//       }else{
        
//         if (usuarioNoBanco.Grupo === 'Gerente') {
//           //console.log("Está no Then do Gerente");
  
//         } else {
//           res.status(403).json({ message: 'Entre em contato com um Gerente para acessar esse usuário.' });
//           return;
//         }

//       }

//     }

    

//     // Rota Loja -  Verificar se está acessando a rota Loja e se é na Loja do Usuário do TOKEN
//     if (idLojaURL && usuarioNoBanco.Lojas_idLoja !== idLojaURL) {
      
//       if (usuarioNoBanco.Grupo === 'Administrador') {
//         //console.log("Entrou no Then do Administrador da Loja ");
        
//       }else{
//         res.status(403).json({ message: 'Verifique a Loja a qual o usuário pertence.' });
//         return;}
      

//     }




//     // Carregar as permissões do banco de dados
    
//     const permissoes = await Permissoes.findAll(
      
      
//       {
      
//       where: {
//         Usuarios_idUsuario: idUsuarioToken,
//         //NomeTabela: nomeTabela
        


//       }
//     });
    
//     //console.log(permissoes);

//     if (!permissoes || permissoes.length === 0) {
//       res.status(403).json({ message: 'Permissão insuficiente para acessar essa tabela.' });
//       return;
//     }



//     // Verifica a permissão de acordo com a ação solicitada
//     const permissao = permissoes[0]; // Assumindo que temos no máximo 1 permissão por tabela
//     const permissaoNecessaria = permissao[acao as keyof typeof permissao];

//     if (permissaoNecessaria) {
//       next(); // Permissão concedida, passa para o próximo middleware ou rota
//     } else {
//       res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
//       return;
//     }
//   };
// };

// export { authMiddleware, checkPermission };

