// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuarios";

// export const login = async (req: Request, res: Response): Promise<void> => {
//   const { Email, Senha } = req.body;

//   const usuario = await Usuario.findOne({ where: { Email } });
//   if (!usuario) {
//     res.status(400).json({ message: "Usuário não encontrado" });
//     return;  // Saímos da função após a resposta
//   }

//   const senhaValida = await bcrypt.compare(Senha, usuario.Senha);
//   if (!senhaValida) {
//     res.status(401).json({ message: "Senha incorreta" });
//     return;  // Saímos da função após a resposta
//   }

//   const token = jwt.sign({ id: usuario.idUsuario }, process.env.JWT_SECRET!, { expiresIn: "1h" });
//   res.json({ token });
// };


// src/controllers/authController.ts
export const login = async (req: Request, res: Response): Promise<void> => {
  const { Email, Senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { Email } });
    if (!usuario) {
      res.status(400).json({ message: "Usuário não encontrado" });
      return;
    }

    const senhaValida = await bcrypt.compare(Senha, usuario.Senha);
    if (!senhaValida) {
      res.status(401).json({ message: "Senha incorreta" });
      return;
    }

    // Obter permissões do grupo
    const permissaoGrupo = obterPermissoesPorGrupo(usuario.Grupo);

    // Criar token incluindo o grupo e permissões
    const token = jwt.sign(
      { 
        id: usuario.idUsuario, 
        grupo: usuario.Grupo, 
        permissoes: permissaoGrupo 
      },
      process.env.JWT_SECRET!, 
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao autenticar usuário' });
  }
};

// Função para obter permissões com base no grupo
const obterPermissoesPorGrupo = (grupo: string) => {
  const permissoes: {
    admin: string[];
    visitante: string[];
    colaborador: string[];
    proprietario: string[];
    userCliente: string[];
    empresa: string[];
    
  } = {
    admin: ['create', 'read', 'update', 'delete'],
    visitante: ['read'],
    colaborador: ['read', 'create', 'update'], 
    proprietario: ['create', 'read', 'update', 'delete'], 
    userCliente: ['read', 'update'], 
    empresa: ['read', 'update'], 
    
  };
  
  // Alteração na lógica de retorno
  return permissoes[grupo as keyof typeof permissoes] || [];
};


