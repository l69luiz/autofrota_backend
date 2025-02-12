// src/controllers/clientesController.ts
import { Request, Response } from 'express';
import { Cliente } from '../models/clientes'; // Modelo de Cliente
//import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todos os clientes da loja do usuário
export const getClientes = [
  //checkPermission('Clientes', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
    
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const clientes = await Cliente.findAll({ where: {  Lojas_idLoja: idLoja } });

      if(clientes.length === 0){
        res.status(500).json({ message: 'Não há clientes cadastrados na sua loja.' });  
      }else{
      res.json(clientes);}
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar clientes' });
      console.log(error);
    }
  },
];

// Função para criar um novo cliente na loja do usuário
export const createCliente = [
  //checkPermission('Clientes', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const {
        Nome,
        CPF_CNPJ,
        Rua,
        Numero,
        Bairro,
        Cidade,
        Celular,
        Celular2,
        RG,
        Tipo_Cliente,
        Email,
        Grupo,
        Data_Nascimento,
        Sexo,
        Estado_Civil,
        
      } = req.body;
      //const {  } = req.user; // ID da loja do usuário logado

      
      // Verificar se o CPF/CNPJ já existe
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const clienteExistente = await Cliente.findOne({ where: { CPF_CNPJ, Lojas_idLoja: idLoja } });
      if (clienteExistente) {
        res.status(400).json({ message: "CPF/CNPJ já está em uso nesta loja." });
        return;
      }

      // Criar o novo cliente
      const Lojas_idLoja = idLoja;
      const cliente = await Cliente.create({
        Nome,
        CPF_CNPJ,
        Rua,
        Numero,
        Bairro,
        Cidade,
        Celular,
        Celular2,
        RG,
        Tipo_Cliente,
        Email,
        Grupo,
        Data_Nascimento,
        Sexo,
        Estado_Civil,
        Lojas_idLoja
      });

      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar cliente' });
    }
  },
];

// Função para excluir um cliente da loja do usuário
export const deleteCliente = [
  //checkPermission('Clientes', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idCliente } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const cliente = await Cliente.findOne({ where: { idCliente, Lojas_idLoja: idLoja } });
      if (!cliente) {
        res.status(404).json({ message: 'Cliente não encontrado nesta loja' });
        return;
      }

      await cliente.destroy();
      res.status(200).json({ message: 'Cliente excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir cliente' });
    }
  },
];

// Função para atualizar os dados de um cliente na loja do usuário
export const updateCliente = [
  //checkPermission('Clientes', 'atualizar'), // Verifica permissão de atualizar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idCliente } = req.params;
      const {
        Nome,
        CPF_CNPJ,
        Rua,
        Numero,
        Bairro,
        Cidade,
        Celular,
        Celular2,
        RG,
        Tipo_Cliente,
        Email,
        Grupo,
        Data_Nascimento,
        Sexo,
        Estado_Civil,
      } = req.body;
      
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const cliente = await Cliente.findOne({ where: { idCliente, Lojas_idLoja: idLoja } });
      if (!cliente) {
        res.status(404).json({ message: 'Cliente não encontrado nesta loja' });
        return;
      }

      cliente.Nome = Nome || cliente.Nome;
      cliente.CPF_CNPJ = CPF_CNPJ || cliente.CPF_CNPJ;
      cliente.Rua = Rua || cliente.Rua;
      cliente.Numero = Numero || cliente.Numero;
      cliente.Bairro = Bairro || cliente.Bairro;
      cliente.Cidade = Cidade || cliente.Cidade;
      cliente.Celular = Celular || cliente.Celular;
      cliente.Celular2 = Celular2 || cliente.Celular2;
      cliente.RG = RG || cliente.RG;
      cliente.Tipo_Cliente = Tipo_Cliente || cliente.Tipo_Cliente;
      cliente.Email = Email || cliente.Email;
      cliente.Grupo = Grupo || cliente.Grupo;
      cliente.Data_Nascimento = Data_Nascimento || cliente.Data_Nascimento;
      cliente.Sexo = Sexo || cliente.Sexo;
      cliente.Estado_Civil = Estado_Civil || cliente.Estado_Civil;

      await cliente.save();
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar cliente' });
    }
  },
];

// Função para buscar cliente por CPF/CNPJ na loja do usuário
export const getClienteByCPF_CNPJ = [
  //checkPermission('Clientes', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { CPF_CNPJ } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const cliente = await Cliente.findOne({ where: { CPF_CNPJ, Lojas_idLoja: idLoja } });

      if (!cliente) {
        res.status(404).json({ message: "Cliente não encontrado com este CPF/CNPJ nesta loja." });
        return;
      }

      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar cliente pelo CPF/CNPJ' });
    }
  },
];

// Função para buscar cliente por ID na loja do usuário
export const getClienteById = [
  //checkPermission('Clientes', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idCliente } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const cliente = await Cliente.findOne({ where: { idCliente, Lojas_idLoja: idLoja } });

      if (!cliente) {
        res.status(404).json({ message: "Cliente não encontrado com este ID nesta loja." });
        return;
      }

      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar cliente pelo ID' });
    }
  },
];




// // src/controllers/clientesController.ts
// import { Request, Response } from 'express';
// import { Cliente } from '../models/clientes'; // Modelo de Cliente
// import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

// // Função para buscar todos os clientes
// export const getClientes = [
//   checkPermission('Clientes', 'ler'), // Verifica permissão de leitura
//   async (req: Request, res: Response) => {
//     try {
//       const clientes = await Cliente.findAll();
//       //const clientes2 = await Cliente.findByPk(11);
//       //console.log(clientes2, "2222"); //apagar
//       res.json(clientes);
//       //console.log(clientes, "FFFF"); //apagar
//     } catch (error) {
//       res.status(500).json({ message: 'Erro ao buscar clientes' });
      
//     }
//   },
// ];

// // Função para criar um novo cliente
// export const createCliente = [
//   checkPermission('Clientes', 'criar'), // Verifica permissão de criação
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const {
//         Nome,
//         CPF_CNPJ,
//         Rua,
//         Numero,
//         Bairro,
//         Cidade,
//         Celular,
//         Celular2,
//         RG,
//         Tipo_Cliente,
//         Email,
//         Grupo,
//         Data_Nascimento,
//         Sexo,
//         Estado_Civil,
//         Lojas_idLoja,
//       } = req.body;

//       // Verificar se o CPF/CNPJ já existe
//       const clienteExistente = await Cliente.findOne({ where: { CPF_CNPJ } });
//       if (clienteExistente) {
//         res.status(400).json({ message: "CPF/CNPJ já está em uso." });
//         return;
//       }

//       // Verificar se o Email já existe
//       const EmailclienteEmUso = await Cliente.findOne({ where: { Email } });
//       if (EmailclienteEmUso) {
//         res.status(400).json({ message: "Email já está em uso." });
//         return;
//       }

//       // Criar o novo cliente
//       const cliente = await Cliente.create({
//         Nome,
//         CPF_CNPJ,
//         Rua,
//         Numero,
//         Bairro,
//         Cidade,
//         Celular,
//         Celular2,
//         RG,
//         Tipo_Cliente,
//         Email,
//         Grupo,
//         Data_Nascimento,
//         Sexo,
//         Estado_Civil,
//         Lojas_idLoja,
//       });

//       res.status(201).json(cliente);
//     } catch (error) {
//       res.status(500).json({ message: 'Erro ao criar cliente' });
//       console.log(error);
//     }
//   },
// ];

// // Função para excluir um cliente
// export const deleteCliente = [
//   checkPermission('Clientes', 'deletar'), // Verifica permissão de deletar
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { idCliente } = req.params;

//       const cliente = await Cliente.findOne({ where: { idCliente } });
//       if (!cliente) {
//         res.status(404).json({ message: 'Cliente não encontrado' });
//         return;
//       }

//       await cliente.destroy();
//       res.status(200).json({ message: 'Cliente excluído com sucesso' });
//     } catch (error) {
//       res.status(500).json({ message: 'Erro ao excluir cliente' });
//     }
//   },
// ];

// // Função para atualizar os dados de um cliente
// export const updateCliente = [
//   checkPermission('Clientes', 'atualizar'), // Verifica permissão de atualizar
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { idCliente } = req.params;
//       const {
//         Nome,
//         CPF_CNPJ,
//         Rua,
//         Numero,
//         Bairro,
//         Cidade,
//         Celular,
//         Celular2,
//         RG,
//         Tipo_Cliente,
//         Email,
//         Grupo,
//         Data_Nascimento,
//         Sexo,
//         Estado_Civil,
//         Lojas_idLoja,
//       } = req.body;

//       const cliente = await Cliente.findOne({ where: { idCliente } });
//       if (!cliente) {
//         res.status(404).json({ message: 'Cliente não encontrado' });
//         return;
//       }

//       cliente.Nome = Nome || cliente.Nome;
//       cliente.CPF_CNPJ = CPF_CNPJ || cliente.CPF_CNPJ;
//       cliente.Rua = Rua || cliente.Rua;
//       cliente.Numero = Numero || cliente.Numero;
//       cliente.Bairro = Bairro || cliente.Bairro;
//       cliente.Cidade = Cidade || cliente.Cidade;
//       cliente.Celular = Celular || cliente.Celular;
//       cliente.Celular2 = Celular2 || cliente.Celular2;
//       cliente.RG = RG || cliente.RG;
//       cliente.Tipo_Cliente = Tipo_Cliente || cliente.Tipo_Cliente;
//       cliente.Email = Email || cliente.Email;
//       cliente.Grupo = Grupo || cliente.Grupo;
//       cliente.Data_Nascimento = Data_Nascimento || cliente.Data_Nascimento;
//       cliente.Sexo = Sexo || cliente.Sexo;
//       cliente.Estado_Civil = Estado_Civil || cliente.Estado_Civil;
//       cliente.Lojas_idLoja = Lojas_idLoja || cliente.Lojas_idLoja;

//       await cliente.save();
//       res.status(200).json(cliente);
//     } catch (error) {
//       res.status(500).json({ message: 'Erro ao atualizar cliente' });
//     }
//   },
// ];

// // Função para buscar cliente por CPF/CNPJ

// export const getClienteByCPF_CNPJ = [
//   checkPermission('Clientes', 'ler'), // Verifica permissão de leitura
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { CPF_CNPJ } = req.params;
//       const cliente = await Cliente.findOne({ where: { CPF_CNPJ } });

//       if (!cliente) {
//         res.status(404).json({ message: "Cliente não encontrado com este CPF/CNPJ." });
//         return;
//       }

//       res.status(200).json(cliente);
//     } catch (error) {
//       res.status(500).json({ message: 'Erro ao buscar cliente pelo CPF/CNPJ' });
//     }
//   },
// ];

// // Função para buscar cliente por ID
// export const getClienteById = [
//   checkPermission('Clientes', 'ler'), // Verifica permissão de leitura
  
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { idCliente } = req.params;
//       const cliente = await Cliente.findByPk(idCliente);

//       if (!cliente) {
//         res.status(404).json({ message: "Cliente não encontrado com este ID." });
//         return;
//       }

//       res.status(200).json(cliente);
//     } catch (error) {
//       res.status(500).json({ message: 'Erro ao buscar cliente pelo ID' });
//     }
//   },
// ];
