// src/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Usuario } from '../models/usuarios';
import { Loja } from '../models/lojas';

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

export const getUsuarios = async (req: CustomRequest, res: Response) => {
  try {
    
    const usuarios = await Usuario.findAll({
      include: {
        model: Loja,
        as: "loja", // Relacionamento com a loja
        attributes: ['idLoja', 'Nome_Loja'] // Selecionando os atributos da loja
        
      }


    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
    //console.log(error);
  }
};


export const createUsuario = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { Nome, CPF_CNPJ, Email, Senha, Lojas_idLoja, ...rest } = req.body;

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
    const usuario = await Usuario.create({
      Nome, CPF_CNPJ, Email, Senha: hashedSenha, Lojas_idLoja, ...rest
    });

    // Retornar resposta de sucesso
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
    console.log(error);
  }
};

// Função para excluir um usuário
export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idUsuario } = req.params;
    

    // Verificar se exite o usuario
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
    console.log(error);
  }
};


// Função para atualizar os dados do usuário
export const updateUsuario = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { idUsuario } = req.params;
    const { Nome, CPF_CNPJ, Rua, Numero, Bairro, Cidade, Celular, Celular2, RG, Tipo, Email, Senha, Grupo, Lojas_idLoja } = req.body;

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
    usuario.Lojas_idLoja = Lojas_idLoja || usuario.Lojas_idLoja;

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
    const usuario = await Usuario.findOne({ where: { CPF_CNPJ }, include: { model: Loja, as: "loja" } });

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
    const usuario = await Usuario.findOne({ where: { Email }, include: { model: Loja, as: "loja" } });

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
    const usuario = await Usuario.findByPk(idUsuario, { include: { model: Loja, as: "loja" } });

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


export const getUsuariosByLoja = async (req: Request, res: Response) => {
  
  const { Lojas_idLoja } = req.params;
  
   // Pegando os dados do token

  try {
    const usuarios = await Usuario.findAll({
      where: { Lojas_idLoja }, // Filtrando pelo id da loja
      include: {
        model: Loja,
        as: "loja", // Relacionamento com a loja
        attributes: ['idLoja', 'Nome_Loja'] // Selecionando os atributos da loja
      }
    });

    if (usuarios.length === 0) {
      res.status(404).json({ message: 'Nenhum usuário encontrado para esta loja.' });
      return;
    }

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários por loja.' });
    console.log(error);
  }
};


export const getUsuariosMyLoja = async (req: CustomRequest, res: Response) => {
  try {
    //const dadosuser = req.user; // Pegando os dados do token
    const idLoja = req.user?.idlojaToken; // Obter o id da loja do token
    
    const whereCondition = idLoja ? { Lojas_idLoja: idLoja } : {};
      
    const usuarios = await Usuario.findAll({
      where: whereCondition,
      include: {
        model: Loja,
        as: "loja", // Relacionamento com a loja
        attributes: ['idLoja', 'Nome_Loja'], // Selecionando os atributos da loja
        
      }
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
    //console.log(error);
  }
};


// interface Request extends Request {
//   user?: {
//     idUserToken: number;
//     idLojaToken: number;
//     permissoestoken: string[]; // Array de permissões
//   };
// }

// // interface JwtPayload {
// //   idUserToken: number;
// //   idlojaToken: number;
// //   permissoesToken: string[]; // Array de permissões do usuário
// // }
