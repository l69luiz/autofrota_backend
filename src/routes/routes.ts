//src/routes/routes.ts
import express from 'express';
import { login } from '../controllers/authController';
import { 
  getUsuariosFilter, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario, 
  //getUsuarioByCpfCnpj, 
  //getUsuarioByEmail, 
  getUsuarioById,
  //getUsuariosByEmpresa,
  //getUsuariosMyEmpresa 
} from '../controllers/usuariosController';

import { 
  getEmpresasFilter, 
  createEmpresa, 
  updateEmpresa, 
  deleteEmpresa, 
  getEmpresaById, 
  getEmpresaByIdToken
} from '../controllers/empresasController'; // Importando as funções de empresas

import { 
  getVeiculosFilter, 
  createVeiculo, 
  updateVeiculo, 
  deleteVeiculo, 
  getVeiculoByPlaca, 
  getVeiculoById 
} from '../controllers/veiculoController';
// import { 
//   getClientes, 
//   createCliente, 
//   updateCliente, 
//   deleteCliente, 
//   getClienteByCPF_CNPJ, 
//   getClienteById,
//   getClientesFilter
// } from '../controllers/clientesController'; // Importando as funções de cliente
import { 
  getEstoques,
  getEstoquesFilter, 
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
import { createContaBancaria, deleteContaBancaria, getContaBancariaById, getContasBancariasFilter, updateContaBancaria } from '../controllers/contasBancariasController';

const router = express.Router();

// Rotas de login
router.post('/login', login);

// Rotas de usuários
//router.get('/usuarios', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuariosMyEmpresa); // Lista todos usuário de todas as empresas
router.get('/usuarios', authMiddleware, checkPermission('Usuarios', 'ler'),getUsuariosFilter); // Lista todos usuário de todas as empresas
router.post('/usuarios', authMiddleware, checkPermission('Usuarios', 'criar'), createUsuario); // Verificando permissão 'criar' para a tabela 'Usuarios'
//router.get('/usuarios/cpfcnpj/:CPF_CNPJ', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarioByCpfCnpj); // Verificando permissão 'ler' para a tabela 'Usuarios'
//router.get('/usuarios/email/:Email', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarioByEmail); // Verificando permissão 'ler' para a tabela 'Usuarios'
router.get('/usuarios/:idUsuario', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuarioById); // Verificando permissão 'ler' para a tabela 'Usuarios'
//router.get('/usuarios/empresa/:Empresas_idEmpresa', authMiddleware, checkPermission('Usuarios', 'ler'), getUsuariosByEmpresa); // Verificando permissão 'ler' para a tabela 'Usuarios'
router.put('/usuarios/:idUsuario', authMiddleware, checkPermission('Usuarios', 'atualizar'), updateUsuario); // Verificando permissão 'atualizar' para a tabela 'Usuarios'
router.delete('/usuarios/:idUsuario', authMiddleware, checkPermission('Usuarios', 'deletar'), deleteUsuario); // Verificando permissão 'deletar' para a tabela 'Usuarios'

// Rotas de veículos
router.get('/veiculos', authMiddleware, checkPermission('Veiculo', 'ler'), getVeiculosFilter); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.post('/veiculos', authMiddleware, checkPermission('Veiculo', 'criar'), createVeiculo); // Verificando permissão 'criar' para a tabela 'Veiculos'
router.get('/veiculos/placa/:Placa_Veiculo', authMiddleware, checkPermission('Veiculo', 'ler'), getVeiculoByPlaca); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.get('/veiculos/:idVeiculo', authMiddleware, checkPermission('Veiculo', 'ler'), getVeiculoById); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.put('/veiculos/:idVeiculo', authMiddleware, checkPermission('Veiculo', 'atualizar'), updateVeiculo); // Verificando permissão 'atualizar' para a tabela 'Veiculos'
router.delete('/veiculos/:idVeiculo', authMiddleware, checkPermission('Veiculo', 'deletar'), deleteVeiculo); // Verificando permissão 'deletar' para a tabela 'Veiculos'

// Rotas de Contas Bancárias
router.get('/contasbancarias', authMiddleware, checkPermission('ContasBancarias', 'ler'), getContasBancariasFilter); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.post('/contasbancarias', authMiddleware, checkPermission('ContasBancarias', 'criar'), createContaBancaria); // Verificando permissão 'criar' para a tabela 'Veiculos'
router.get('/contasbancarias/:idContasBancarias', authMiddleware, checkPermission('ContasBancarias', 'ler'), getContaBancariaById); // Verificando permissão 'ler' para a tabela 'Veiculos'
router.put('/contasbancarias/:idContasBancarias', authMiddleware, checkPermission('ContasBancarias', 'atualizar'), updateContaBancaria); // Verificando permissão 'atualizar' para a tabela 'Veiculos'
router.delete('/contasbancarias/:idContasBancarias', authMiddleware, checkPermission('ContasBancarias', 'deletar'), deleteContaBancaria); // Verificando permissão 'deletar' para a tabela 'Veiculos'

// // Rotas de clientes
// //const urlRelativa = `/pessoas?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`;
// //router.get('/clientes', authMiddleware, checkPermission('Clientes', 'ler'), getClientes); // Verificando permissão 'ler' para a tabela 'Clientes'
// router.get('/clientes', authMiddleware, checkPermission('Clientes', 'ler'), getClientesFilter); // Verificando permissão 'ler' para a tabela 'Clientes'
// router.post('/clientes', authMiddleware, checkPermission('Clientes', 'criar'), createCliente); // Verificando permissão 'criar' para a tabela 'Clientes'
// router.get('/clientes/cpfcnpj/:CPF_CNPJ', authMiddleware, checkPermission('Clientes', 'ler'), getClienteByCPF_CNPJ); // Verificando permissão 'ler' para a tabela 'Clientes'
// router.get('/clientes/:idCliente', authMiddleware, checkPermission('Clientes', 'ler'), getClienteById); // Verificando permissão 'ler' para a tabela 'Clientes'
// router.put('/clientes/:idCliente', authMiddleware, checkPermission('Clientes', 'atualizar'), updateCliente); // Verificando permissão 'atualizar' para a tabela 'Clientes'
// router.delete('/clientes/:idCliente', authMiddleware, checkPermission('Clientes', 'deletar'), deleteCliente); // Verificando permissão 'deletar' para a tabela 'Clientes'

// Rotas de estoque
router.get('/estoques', authMiddleware, checkPermission('Estoque', 'ler'), getEstoquesFilter); // Verificando permissão 'ler' para a tabela 'Estoques'
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

// Rotas de empresas
router.get('/empresas/filter', authMiddleware, checkPermission('Empresas', 'ler'), getEmpresasFilter); // Verificando permissão 'ler' para a tabela 'Empresas'
router.get('/empresa/detalhe', authMiddleware, checkPermission('Empresas', 'ler'), getEmpresaByIdToken); // Verificando permissão 'ler' para a tabela 'Empresas'
router.post('/empresas', authMiddleware, checkPermission('Empresas', 'criar'), createEmpresa); // Verificando permissão 'criar' para a tabela 'Empresas'
router.get('/empresas/:idEmpresa', authMiddleware, checkPermission('Empresas', 'ler'), getEmpresaById); // Verificando permissão 'ler' para a tabela 'Empresas'
router.put('/empresas/:idEmpresa', authMiddleware, checkPermission('Empresas', 'atualizar'), updateEmpresa); // Verificando permissão 'atualizar' para a tabela 'Empresas'
router.delete('/empresas/:idEmpresa', authMiddleware, checkPermission('Empresas', 'deletar'), deleteEmpresa); // Verificando permissão 'deletar' para a tabela 'Empresas'

// Rotas de tipo de manutenção
router.get('/tipoManutencao', authMiddleware, checkPermission('TipoManutencao', 'ler'), getTipoManutencao); // Verificando permissão 'ler' para a tabela 'TipoManutencao'
router.post('/tipoManutencao', authMiddleware, checkPermission('TipoManutencao', 'criar'), createTipoManutencao); // Verificando permissão 'criar' para a tabela 'TipoManutencao'
router.get('/tipoManutencao/:idTipoManutencao', authMiddleware, checkPermission('TipoManutencao', 'ler'), getTipoManutencaoById); // Verificando permissão 'ler' para a tabela 'TipoManutencao'
router.put('/tipoManutencao/:idTipoManutencao', authMiddleware, checkPermission('TipoManutencao', 'atualizar'), updateTipoManutencao); // Verificando permissão 'atualizar' para a tabela 'TipoManutencao'
router.delete('/tipoManutencao/:idTipoManutencao', authMiddleware, checkPermission('TipoManutencao', 'deletar'), deleteTipoManutencao); // Verificando permissão 'deletar' para a tabela 'TipoManutencao'


export default router;
