//src/routes/routes.ts
import express from 'express';
import { login } from '../controllers/authController';
import { 
  getUsuarios, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario, 
  //getUsuarioByCpfCnpj, 
  //getUsuarioByEmail, 
  getUsuarioById,
  //getUsuariosByLoja,
  //getUsuariosMyLoja 
} from '../controllers/usuariosController';

import { 
  getLojas, 
  createLoja, 
  updateLoja, 
  deleteLoja, 
  getLojaById 
} from '../controllers/lojasController'; // Importando as funções de lojas

import { 
  getVeiculos, 
  createVeiculo, 
  updateVeiculo, 
  deleteVeiculo, 
  getVeiculoByPlaca, 
  getVeiculoById 
} from '../controllers/veiculoController';
import { 
  getClientes, 
  createCliente, 
  updateCliente, 
  deleteCliente, 
  getClienteByCPF_CNPJ, 
  getClienteById
} from '../controllers/clientesController'; // Importando as funções de cliente
import { 
  getEstoques, 
  createEstoque, 
  updateEstoque, 
  deleteEstoque, 
  getEstoqueById 
} from '../controllers/estoquesController'; // Importando as funções de estoque
import { 
  getContratos, 
  createContrato, 
  updateContrato, 
  deleteContrato, 
  getContratoById 
} from '../controllers/contratosController'; // Importando as funções de contratos
import { 
  getFinanciamentos, 
  createFinanciamento, 
  updateFinanciamento, 
  deleteFinanciamento, 
  getFinanciamentoById 
} from '../controllers/financiamentosController'; // Importando as funções de financiamentos
import { 
  getManutencoes, 
  createManutencao, 
  updateManutencao, 
  deleteManutencao, 
  getManutencaoById 
} from '../controllers/manutencoesController'; // Importando as funções de manutenção
import { 
  getPagamentos, 
  createPagamento, 
  updatePagamento, 
  deletePagamento, 
  getPagamentoById 
} from '../controllers/pagamentosController'; // Importando as funções de pagamentos
import { 
  getPermissoes, 
  createPermissao, 
  updatePermissao, 
  deletePermissao, 
  getPermissaoById 
} from '../controllers/permissoesController'; // Importando as funções de permissões
import { 
  getTestDrives, 
  createTestDrive, 
  updateTestDrive, 
  deleteTestDrive, 
  getTestDriveById 
} from '../controllers/testDrivesController'; // Importando as funções de test drives
import { 
  getVendas, 
  createVenda, 
  updateVenda, 
  deleteVenda, 
  getVendaById 
} from '../controllers/vendasController'; // Importando as funções de vendas
import { 
  getVistorias, 
  createVistoria, 
  updateVistoria, 
  deleteVistoria, 
  getVistoriaById 
} from '../controllers/vistoriasController'; // Importando as funções de vistorias
import {
  getTipoManutencao,
  createTipoManutencao,
  updateTipoManutencao,
  deleteTipoManutencao,
  getTipoManutencaoById
} from '../controllers/tipoManutencaoController'; // Importando as funções do tipo de manutenção

import { authMiddleware, checkPermission } from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas de login
router.post('/login', login);

// Rotas de usuários
//router.get('/usuarios', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuariosMyLoja); // Lista todos usuário de todas as lojas
router.get('/usuarios/todos', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarios); // Lista todos usuário de todas as lojas
router.post('/usuarios', authMiddleware, checkPermission('Usuarios', 'criar'), createUsuario); // Verificando permissão 'criar' para a tabela 'Usuarios'
//router.get('/usuarios/cpfcnpj/:CPF_CNPJ', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarioByCpfCnpj); // Verificando permissão 'ler' para a tabela 'Usuarios'
//router.get('/usuarios/email/:Email', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarioByEmail); // Verificando permissão 'ler' para a tabela 'Usuarios'
router.get('/usuarios/:idUsuario', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarioById); // Verificando permissão 'ler' para a tabela 'Usuarios'
//router.get('/usuarios/loja/:Lojas_idLoja', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuariosByLoja); // Verificando permissão 'ler' para a tabela 'Usuarios'
router.put('/usuarios/:idUsuario', authMiddleware, checkPermission('Usuarios', 'atualizar'), updateUsuario); // Verificando permissão 'atualizar' para a tabela 'Usuarios'
router.delete('/usuarios/:idUsuario', authMiddleware, checkPermission('Usuarios', 'deletar'), deleteUsuario); // Verificando permissão 'deletar' para a tabela 'Usuarios'

// Rotas de veículos
router.get('/veiculos', authMiddleware, checkPermission('Veiculo', 'ler'), getVeiculos); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.post('/veiculos', authMiddleware, checkPermission('Veiculo', 'criar'), createVeiculo); // Verificando permissão 'criar' para a tabela 'Veiculos'
router.get('/veiculos/placa/:Placa_Veiculo', authMiddleware, checkPermission('Veiculo', 'ler'), getVeiculoByPlaca); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.get('/veiculos/:idVeiculo', authMiddleware, checkPermission('Veiculo', 'ler'), getVeiculoById); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.put('/veiculos/:idVeiculo', authMiddleware, checkPermission('Veiculo', 'atualizar'), updateVeiculo); // Verificando permissão 'atualizar' para a tabela 'Veiculos'
router.delete('/veiculos/:idVeiculo', authMiddleware, checkPermission('Veiculo', 'deletar'), deleteVeiculo); // Verificando permissão 'deletar' para a tabela 'Veiculos'

// Rotas de clientes
router.get('/clientes', authMiddleware, checkPermission('Clientes', 'ler'), getClientes); // Verificando permissão 'ler' para a tabela 'Clientes'
router.post('/clientes', authMiddleware, checkPermission('Clientes', 'criar'), createCliente); // Verificando permissão 'criar' para a tabela 'Clientes'
router.get('/clientes/cpfcnpj/:CPF_CNPJ', authMiddleware, checkPermission('Clientes', 'ler'), getClienteByCPF_CNPJ); // Verificando permissão 'ler' para a tabela 'Clientes'
router.get('/clientes/:idCliente', authMiddleware, checkPermission('Clientes', 'ler'), getClienteById); // Verificando permissão 'ler' para a tabela 'Clientes'
router.put('/clientes/:idCliente', authMiddleware, checkPermission('Clientes', 'atualizar'), updateCliente); // Verificando permissão 'atualizar' para a tabela 'Clientes'
router.delete('/clientes/:idCliente', authMiddleware, checkPermission('Clientes', 'deletar'), deleteCliente); // Verificando permissão 'deletar' para a tabela 'Clientes'

// Rotas de estoque
router.get('/estoques', authMiddleware, checkPermission('Estoque', 'ler'), getEstoques); // Verificando permissão 'ler' para a tabela 'Estoques'
router.post('/estoques', authMiddleware, checkPermission('Estoque', 'criar'), createEstoque); // Verificando permissão 'criar' para a tabela 'Estoques'
router.get('/estoques/:idEstoque', authMiddleware, checkPermission('Estoque', 'ler'), getEstoqueById); // Verificando permissão 'ler' para a tabela 'Estoques'
router.put('/estoques/:idEstoque', authMiddleware, checkPermission('Estoque', 'atualizar'), updateEstoque); // Verificando permissão 'atualizar' para a tabela 'Estoques'
router.delete('/estoques/:idEstoque', authMiddleware, checkPermission('Estoque', 'deletar'), deleteEstoque); // Verificando permissão 'deletar' para a tabela 'Estoques'

// Rotas de contratos
router.get('/contratos', authMiddleware, checkPermission('Contrato', 'ler'), getContratos); // Verificando permissão 'ler' para a tabela 'Contratos'
router.post('/contratos', authMiddleware, checkPermission('Contrato', 'criar'), createContrato); // Verificando permissão 'criar' para a tabela 'Contratos'
router.get('/contratos/:idContrato', authMiddleware, checkPermission('Contrato', 'ler'), getContratoById); // Verificando permissão 'ler' para a tabela 'Contratos'
router.put('/contratos/:idContrato', authMiddleware, checkPermission('Contrato', 'atualizar'), updateContrato); // Verificando permissão 'atualizar' para a tabela 'Contratos'
router.delete('/contratos/:idContrato', authMiddleware, checkPermission('Contrato', 'deletar'), deleteContrato); // Verificando permissão 'deletar' para a tabela 'Contratos'

// Rotas de financiamentos
router.get('/financiamentos', authMiddleware, checkPermission('Financiamento', 'ler'), getFinanciamentos); // Verificando permissão 'ler' para a tabela 'Financiamentos'
router.post('/financiamentos', authMiddleware, checkPermission('Financiamento', 'criar'), createFinanciamento); // Verificando permissão 'criar' para a tabela 'Financiamentos'
router.get('/financiamentos/:idFinanciamento', authMiddleware, checkPermission('Financiamento', 'ler'), getFinanciamentoById); // Verificando permissão 'ler' para a tabela 'Financiamentos'
router.put('/financiamentos/:idFinanciamento', authMiddleware, checkPermission('Financiamento', 'atualizar'), updateFinanciamento); // Verificando permissão 'atualizar' para a tabela 'Financiamentos'
router.delete('/financiamentos/:idFinanciamento', authMiddleware, checkPermission('Financiamento', 'deletar'), deleteFinanciamento); // Verificando permissão 'deletar' para a tabela 'Financiamentos'

// Rotas de manutenções
router.get('/manutencao', authMiddleware, checkPermission('Manutencao', 'ler'), getManutencoes); // Verificando permissão 'ler' para a tabela 'Manutencao'
router.post('/manutencao', authMiddleware, checkPermission('Manutencao', 'criar'), createManutencao); // Verificando permissão 'criar' para a tabela 'Manutencao'
router.get('/manutencao/:idManutencao', authMiddleware, checkPermission('Manutencao', 'ler'), getManutencaoById); // Verificando permissão 'ler' para a tabela 'Manutencao'
router.put('/manutencao/:idManutencao', authMiddleware, checkPermission('Manutencao', 'atualizar'), updateManutencao); // Verificando permissão 'atualizar' para a tabela 'Manutencao'
router.delete('/manutencao/:idManutencao', authMiddleware, checkPermission('Manutencao', 'deletar'), deleteManutencao); // Verificando permissão 'deletar' para a tabela 'Manutencao'

// Rotas de pagamentos
router.get('/pagamentos', authMiddleware, checkPermission('Pagamento', 'ler'), getPagamentos); // Verificando permissão 'ler' para a tabela 'Pagamentos'
router.post('/pagamentos', authMiddleware, checkPermission('Pagamento', 'criar'), createPagamento); // Verificando permissão 'criar' para a tabela 'Pagamentos'
router.get('/pagamentos/:idPagamento', authMiddleware, checkPermission('Pagamento', 'ler'), getPagamentoById); // Verificando permissão 'ler' para a tabela 'Pagamentos'
router.put('/pagamentos/:idPagamento', authMiddleware, checkPermission('Pagamento', 'atualizar'), updatePagamento); // Verificando permissão 'atualizar' para a tabela 'Pagamentos'
router.delete('/pagamentos/:idPagamento', authMiddleware, checkPermission('Pagamento', 'deletar'), deletePagamento); // Verificando permissão 'deletar' para a tabela 'Pagamentos'

// Rotas de permissões
router.get('/permissoes', authMiddleware, checkPermission('Permissao', 'ler'), getPermissoes); // Verificando permissão 'ler' para a tabela 'Permissoes'
router.post('/permissoes', authMiddleware, checkPermission('Permissao', 'criar'), createPermissao); // Verificando permissão 'criar' para a tabela 'Permissoes'
router.get('/permissoes/:idPermissao', authMiddleware, checkPermission('Permissao', 'ler'), getPermissaoById); // Verificando permissão 'ler' para a tabela 'Permissoes'
router.put('/permissoes/:idPermissao', authMiddleware, checkPermission('Permissao', 'atualizar'), updatePermissao); // Verificando permissão 'atualizar' para a tabela 'Permissoes'
router.delete('/permissoes/:idPermissao', authMiddleware, checkPermission('Permissao', 'deletar'), deletePermissao); // Verificando permissão 'deletar' para a tabela 'Permissoes'

// Rotas de test drives
router.get('/testdrives', authMiddleware, checkPermission('TestDrive', 'ler'), getTestDrives); // Verificando permissão 'ler' para a tabela 'TestDrives'
router.post('/testdrives', authMiddleware, checkPermission('TestDrive', 'criar'), createTestDrive); // Verificando permissão 'criar' para a tabela 'TestDrives'
router.get('/testdrives/:idTestDrive', authMiddleware, checkPermission('TestDrive', 'ler'), getTestDriveById); // Verificando permissão 'ler' para a tabela 'TestDrives'
router.put('/testdrives/:idTestDrive', authMiddleware, checkPermission('TestDrive', 'atualizar'), updateTestDrive); // Verificando permissão 'atualizar' para a tabela 'TestDrives'
router.delete('/testdrives/:idTestDrive', authMiddleware, checkPermission('TestDrive', 'deletar'), deleteTestDrive); // Verificando permissão 'deletar' para a tabela 'TestDrives'

// Rotas de vendas
router.get('/vendas', authMiddleware, checkPermission('Venda', 'ler'), getVendas); // Verificando permissão 'ler' para a tabela 'Vendas'
router.post('/vendas', authMiddleware, checkPermission('Venda', 'criar'), createVenda); // Verificando permissão 'criar' para a tabela 'Vendas'
router.get('/vendas/:idVenda', authMiddleware, checkPermission('Venda', 'ler'), getVendaById); // Verificando permissão 'ler' para a tabela 'Vendas'
router.put('/vendas/:idVenda', authMiddleware, checkPermission('Venda', 'atualizar'), updateVenda); // Verificando permissão 'atualizar' para a tabela 'Vendas'
router.delete('/vendas/:idVenda', authMiddleware, checkPermission('Venda', 'deletar'), deleteVenda); // Verificando permissão 'deletar' para a tabela 'Vendas'

// Rotas de vistorias
router.get('/vistorias', authMiddleware, checkPermission('Vistoria', 'ler'), getVistorias); // Verificando permissão 'ler' para a tabela 'Vistorias'
router.post('/vistorias', authMiddleware, checkPermission('Vistoria', 'criar'), createVistoria); // Verificando permissão 'criar' para a tabela 'Vistorias'
router.get('/vistorias/:idVistoria', authMiddleware, checkPermission('Vistoria', 'ler'), getVistoriaById); // Verificando permissão 'ler' para a tabela 'Vistorias'
router.put('/vistorias/:idVistoria', authMiddleware, checkPermission('Vistoria', 'atualizar'), updateVistoria); // Verificando permissão 'atualizar' para a tabela 'Vistorias'
router.delete('/vistorias/:idVistoria', authMiddleware, checkPermission('Vistoria', 'deletar'), deleteVistoria); // Verificando permissão 'deletar' para a tabela 'Vistorias'

// Rotas de lojas
router.get('/lojas', authMiddleware, checkPermission('Loja', 'ler'), getLojas); // Verificando permissão 'ler' para a tabela 'Lojas'
router.post('/lojas', authMiddleware, checkPermission('Loja', 'criar'), createLoja); // Verificando permissão 'criar' para a tabela 'Lojas'
router.get('/lojas/:idLoja', authMiddleware, checkPermission('Loja', 'ler'), getLojaById); // Verificando permissão 'ler' para a tabela 'Lojas'
router.put('/lojas/:idLoja', authMiddleware, checkPermission('Loja', 'atualizar'), updateLoja); // Verificando permissão 'atualizar' para a tabela 'Lojas'
router.delete('/lojas/:idLoja', authMiddleware, checkPermission('Loja', 'deletar'), deleteLoja); // Verificando permissão 'deletar' para a tabela 'Lojas'

// Rotas de tipo de manutenção
router.get('/tipoManutencao', authMiddleware, checkPermission('TipoManutencao', 'ler'), getTipoManutencao); // Verificando permissão 'ler' para a tabela 'TipoManutencao'
router.post('/tipoManutencao', authMiddleware, checkPermission('TipoManutencao', 'criar'), createTipoManutencao); // Verificando permissão 'criar' para a tabela 'TipoManutencao'
router.get('/tipoManutencao/:idTipoManutencao', authMiddleware, checkPermission('TipoManutencao', 'ler'), getTipoManutencaoById); // Verificando permissão 'ler' para a tabela 'TipoManutencao'
router.put('/tipoManutencao/:idTipoManutencao', authMiddleware, checkPermission('TipoManutencao', 'atualizar'), updateTipoManutencao); // Verificando permissão 'atualizar' para a tabela 'TipoManutencao'
router.delete('/tipoManutencao/:idTipoManutencao', authMiddleware, checkPermission('TipoManutencao', 'deletar'), deleteTipoManutencao); // Verificando permissão 'deletar' para a tabela 'TipoManutencao'


export default router;
