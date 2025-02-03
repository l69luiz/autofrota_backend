// src/routes/routes.ts
import express from 'express';
import { login } from '../controllers/authController';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario, getUsuarioByCpfCnpj, getUsuarioByEmail, getUsuarioById } from '../controllers/userController';
import { authMiddleware, checkPermission } from '../middlewares/authMiddleware';

const router = express.Router();

// Rota de login
router.post('/login', login);

// Rota para listar todos os usuários (apenas leitura)
router.get('/usuarios', authMiddleware, checkPermission('read'), getUsuarios);

// Rota para criar um novo usuário (apenas para admins)
router.post('/usuarios', authMiddleware, checkPermission('create'), createUsuario);

// Rota para buscar usuário pelo CPF/CNPJ (apenas leitura)
router.get('/usuarios/cpfcnpj/:CPF_CNPJ', authMiddleware, checkPermission('read'), getUsuarioByCpfCnpj);

// Rota para buscar usuário pelo Email (apenas leitura)
router.get('/usuarios/email/:Email', authMiddleware, checkPermission('read'), getUsuarioByEmail);

// Rota para buscar usuário pelo ID (apenas leitura)
router.get('/usuarios/:idUsuario', authMiddleware, checkPermission('read'), getUsuarioById);

// Rota para atualizar um usuário (apenas para admins ou usuários com permissão de 'update')
router.put('/usuarios/:idUsuario', authMiddleware, checkPermission('update'), updateUsuario);

// Rota para deletar um usuário (apenas para admins)
router.delete('/usuarios/:idUsuario', authMiddleware, checkPermission('delete'), deleteUsuario);

export default router;
