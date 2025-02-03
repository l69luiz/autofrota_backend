// src/routes/routes.ts
import express from 'express';
import { login } from '../controllers/authController';
import { 
  getUsuarios, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario, 
  getUsuarioByCpfCnpj, 
  getUsuarioByEmail, 
  getUsuarioById 
} from '../controllers/userController';
import { 
  getVeiculos, 
  createVeiculo, 
  updateVeiculo, 
  deleteVeiculo, 
  getVeiculoByPlaca, 
  getVeiculoById 
} from '../controllers/veiculoController';
import { authMiddleware, checkPermission } from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas de login
router.post('/login', login);

// Rotas de usuários
router.get('/usuarios', authMiddleware, checkPermission('read'), getUsuarios);
router.post('/usuarios', authMiddleware, checkPermission('create'), createUsuario);
router.get('/usuarios/cpfcnpj/:CPF_CNPJ', authMiddleware, checkPermission('read'), getUsuarioByCpfCnpj);
router.get('/usuarios/email/:Email', authMiddleware, checkPermission('read'), getUsuarioByEmail);
router.get('/usuarios/:idUsuario', authMiddleware, checkPermission('read'), getUsuarioById);
router.put('/usuarios/:idUsuario', authMiddleware, checkPermission('update'), updateUsuario);
router.delete('/usuarios/:idUsuario', authMiddleware, checkPermission('delete'), deleteUsuario);

// Rotas de veículos
router.get('/veiculos', authMiddleware, checkPermission('read'), getVeiculos);
router.post('/veiculos', authMiddleware, checkPermission('create'), createVeiculo);
router.get('/veiculos/placa/:Placa_Veiculo', authMiddleware, checkPermission('read'), getVeiculoByPlaca);
router.get('/veiculos/:idVeiculo', authMiddleware, checkPermission('read'), getVeiculoById);
router.put('/veiculos/:idVeiculo', authMiddleware, checkPermission('update'), updateVeiculo);
router.delete('/veiculos/:idVeiculo', authMiddleware, checkPermission('delete'), deleteVeiculo);

export default router;

