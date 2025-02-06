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
router.get('/usuarios', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarios); // Verificando permissão 'ler' para a tabela 'Usuarios'
router.post('/usuarios', authMiddleware, checkPermission('Usuarios', 'criar'), createUsuario); // Verificando permissão 'criar' para a tabela 'Usuarios'
router.get('/usuarios/cpfcnpj/:CPF_CNPJ', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarioByCpfCnpj); // Verificando permissão 'ler' para a tabela 'Usuarios'
router.get('/usuarios/email/:Email', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarioByEmail); // Verificando permissão 'ler' para a tabela 'Usuarios'
router.get('/usuarios/:idUsuario', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarioById); // Verificando permissão 'ler' para a tabela 'Usuarios'
router.put('/usuarios/:idUsuario', authMiddleware, checkPermission('Usuarios', 'atualizar'), updateUsuario); // Verificando permissão 'atualizar' para a tabela 'Usuarios'
router.delete('/usuarios/:idUsuario', authMiddleware, checkPermission('Usuarios', 'deletar'), deleteUsuario); // Verificando permissão 'deletar' para a tabela 'Usuarios'

// Rotas de veículos
router.get('/veiculos', authMiddleware, checkPermission('Veiculos', 'ler'), getVeiculos); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.post('/veiculos', authMiddleware, checkPermission('Veiculos', 'criar'), createVeiculo); // Verificando permissão 'criar' para a tabela 'Veiculos'
router.get('/veiculos/placa/:Placa_Veiculo', authMiddleware, checkPermission('Veiculos', 'ler'), getVeiculoByPlaca); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.get('/veiculos/:idVeiculo', authMiddleware, checkPermission('Veiculos', 'ler'), getVeiculoById); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.put('/veiculos/:idVeiculo', authMiddleware, checkPermission('Veiculos', 'atualizar'), updateVeiculo); // Verificando permissão 'atualizar' para a tabela 'Veiculos'
router.delete('/veiculos/:idVeiculo', authMiddleware, checkPermission('Veiculos', 'deletar'), deleteVeiculo); // Verificando permissão 'deletar' para a tabela 'Veiculos'

export default router;





// // src/routes/routes.ts
// import express from 'express';
// import { login } from '../controllers/authController';
// import { 
//   getUsuarios, 
//   createUsuario, 
//   updateUsuario, 
//   deleteUsuario, 
//   getUsuarioByCpfCnpj, 
//   getUsuarioByEmail, 
//   getUsuarioById 
// } from '../controllers/userController';
// import { 
//   getVeiculos, 
//   createVeiculo, 
//   updateVeiculo, 
//   deleteVeiculo, 
//   getVeiculoByPlaca, 
//   getVeiculoById 
// } from '../controllers/veiculoController';
// import { authMiddleware, checkPermission } from '../middlewares/authMiddleware';

// const router = express.Router();

// // Rotas de login
// router.post('/login', login);

// // Rotas de usuários
// router.get('/usuarios', authMiddleware, checkPermission('read'), getUsuarios);
// router.post('/usuarios', authMiddleware, checkPermission('create'), createUsuario);
// router.get('/usuarios/cpfcnpj/:CPF_CNPJ', authMiddleware, checkPermission('read'), getUsuarioByCpfCnpj);
// router.get('/usuarios/email/:Email', authMiddleware, checkPermission('read'), getUsuarioByEmail);
// router.get('/usuarios/:idUsuario', authMiddleware, checkPermission('read'), getUsuarioById);
// router.put('/usuarios/:idUsuario', authMiddleware, checkPermission('update'), updateUsuario);
// router.delete('/usuarios/:idUsuario', authMiddleware, checkPermission('delete'), deleteUsuario);

// // Rotas de veículos
// router.get('/veiculos', authMiddleware, checkPermission('read'), getVeiculos);
// router.post('/veiculos', authMiddleware, checkPermission('create'), createVeiculo);
// router.get('/veiculos/placa/:Placa_Veiculo', authMiddleware, checkPermission('read'), getVeiculoByPlaca);
// router.get('/veiculos/:idVeiculo', authMiddleware, checkPermission('read'), getVeiculoById);
// router.put('/veiculos/:idVeiculo', authMiddleware, checkPermission('update'), updateVeiculo);
// router.delete('/veiculos/:idVeiculo', authMiddleware, checkPermission('delete'), deleteVeiculo);

// export default router;

