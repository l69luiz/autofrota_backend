//src/routes/clientesRoutes.ts
import express from 'express';
import { 
    //getClientes, 
    createCliente, 
    updateCliente, 
    deleteCliente, 
    getClienteByCPF_CNPJ, 
    getClienteById,
    getClientesFilter
  } from '../controllers/clientesController'; // Importando as funções de cliente

  import { authMiddleware, checkPermission } from '../middlewares/authMiddleware';
  
  const rotasClientes = express.Router();
 
// Rotas de clientes
//const urlRelativa = `/pessoas?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`;
//router.get('/clientes', authMiddleware, checkPermission('Clientes', 'ler'), getClientes); // Verificando permissão 'ler' para a tabela 'Clientes'
rotasClientes.get('/clientes', authMiddleware, checkPermission('Clientes', 'ler'), getClientesFilter); // Verificando permissão 'ler' para a tabela 'Clientes'
rotasClientes.post('/clientes', authMiddleware, checkPermission('Clientes', 'criar'), createCliente); // Verificando permissão 'criar' para a tabela 'Clientes'
rotasClientes.get('/clientes/cpfcnpj/:CPF_CNPJ', authMiddleware, checkPermission('Clientes', 'ler'), getClienteByCPF_CNPJ); // Verificando permissão 'ler' para a tabela 'Clientes'
rotasClientes.get('/clientes/:idCliente', authMiddleware, checkPermission('Clientes', 'ler'), getClienteById); // Verificando permissão 'ler' para a tabela 'Clientes'
rotasClientes.put('/clientes/:idCliente', authMiddleware, checkPermission('Clientes', 'atualizar'), updateCliente); // Verificando permissão 'atualizar' para a tabela 'Clientes'
rotasClientes.delete('/clientes/:idCliente', authMiddleware, checkPermission('Clientes', 'deletar'), deleteCliente); // Verificando permissão 'deletar' para a tabela 'Clientes'


export default rotasClientes;
