// src/controllers/clientesController.ts
import { Request, Response } from 'express';
import { Cliente } from '../models/clientes'; // Modelo de Cliente
import { Op } from 'sequelize';
//import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// // Função para buscar todos os clientes da loja do usuário
// export const getClientes = [
//   //checkPermission('Clientes', 'ler'), // Verifica permissão de leitura
//   async (req: CustomRequest, res: Response) => {
//     try {

//       const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
//       const clientes = await Cliente.findAll({ where: {  Lojas_idLoja: idLoja } });

//       if(clientes.length === 0){
//         res.status(500).json({ message: 'Não há clientes cadastrados na sua loja.' });  
//       }else{
//       res.json(clientes);}
//     } catch (error) {
//       res.status(500).json({ message: 'Erro ao buscar clientes' });
//       console.log(error);
//     }
//   },
// ];

// Função para buscar todos os clientes da loja com filtros
export const getClientesFilter = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Pega o ID da loja do usuário autenticado
    const idLoja = req.user?.idlojaToken;

    // Pega os parâmetros da URL (para filtros e paginação)
    const { _page, _limit, nome_like } = req.query;

    // Converte _page e _limit para inteiros e define valores padrão caso sejam inválidos
    const page = !isNaN(parseInt(_page as string)) ? parseInt(_page as string, 10) : 1;
    const limit = !isNaN(parseInt(_limit as string)) ? parseInt(_limit as string, 10) : 10;
    const offset = (page - 1) * limit;

    // Constrói a condição de filtro para o nome completo, se fornecido
    const whereCondition = {
      Lojas_idLoja: idLoja, // Filtro pela loja do usuário logado
      ...(nome_like && {
        Nome: {
          [Op.like]: `%${nome_like}%`,
        },
      }),
    };

    // Faz a consulta ao banco de dados com paginação e filtro
    const clientes = await Cliente.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
    });

    // Verifica se há clientes e envia a resposta apropriada
    if (clientes.rows.length === 0) {
      res.status(404).json({ message: 'Não há clientes cadastrados na sua loja.' });
    } else {
      // Envia a lista de clientes com a contagem total, paginação e dados
      res.status(200).json({
        data: clientes.rows,
        totalCount: clientes.count,
        page,
        limit,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes' });
    //console.log(error);
  }
};



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
        StatusAutoRastrear,
        StatusLoja

      } = req.body;
      //const {  } = req.user; // ID da loja do usuário logado


      // Verificar se o CPF/CNPJ já existe
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const clienteExistente = await Cliente.findOne({ where: { CPF_CNPJ, Lojas_idLoja: idLoja } });
      if (clienteExistente) {
        res.status(400).json({ message: "CPF/CNPJ já está em uso nesta loja." });
        return;
      }
      // Verificar se o Email já existe
      //const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado
      const clienteExistenteEmail = await Cliente.findOne({ where: { Email, Lojas_idLoja: idLoja } });
      if (clienteExistenteEmail) {
        res.status(400).json({ message: "Email já está em uso nesta loja." });
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
        Lojas_idLoja,
        StatusAutoRastrear,
        StatusLoja
      });

      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar cliente' });
      console.log(error);
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
      //console.log("ID: ", idLoja);
      const cliente = await Cliente.findOne({ where: { idCliente, Lojas_idLoja: idLoja } });
      //console.log("CL: ", cliente);
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



// export const verificarEmailBanco = async (idClienteAtaul: number, emaildigitado: string,  idLoja: number) => {

//   const clienteExistenteEmail = await Cliente.findOne({ where: { Email: emaildigitado, Lojas_idLoja: idLoja, idCliente: idClienteAtaul } });
//     if (clienteExistenteEmail) {
//       console.log("Igual");
//       return "igual";
//     }
//     else{
//         const clienteExistenteEmail2 = await Cliente.findOne({ where: { Email: emaildigitado, Lojas_idLoja: idLoja } });
//         if (clienteExistenteEmail2) {
  
//         console.log("Diferente mas tem no banco");
//         return "Proibido";
//       }else{  
//         console.log("Não tem no banco");
//         return "Ausente";
//       }
      
  
      
      
//    } 

// };

// export const verificarCPF_CNPJBanco = async (CPF_CNPJdigitado: string, idLoja: number | undefined): Promise<boolean> => {
//     const clienteExistenteCPF_CNPJ = await Cliente.findOne({ where: { CPF_CNPJ: CPF_CNPJdigitado, Lojas_idLoja: idLoja } });
//     if (clienteExistenteCPF_CNPJ) {
//       return true;
//     }else{
//       return false;
//    }
// };



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

    // Verificar se o e-mail foi alterado
    if (Email && Email !== cliente.Email) {
      // Verificar se o novo e-mail já está em uso em outra conta na mesma loja
      const clienteExistenteEmail = await Cliente.findOne({
        where: {
          Email,
          Lojas_idLoja: idLoja,
          idCliente: { [Op.ne]: idCliente }, // Exclui o cliente atual da verificação
        },
      });

      if (clienteExistenteEmail) {
        res.status(400).json({ message: "O novo e-mail já está em uso nesta loja." });
        return;
      }

      // Atualizar o e-mail se não estiver em uso
      cliente.Email = Email;
    }

    // Verificar se o CPF_CNPJ foi alterado
    if (CPF_CNPJ && CPF_CNPJ !== cliente.CPF_CNPJ) {
      // Verificar se o novo CPF_CNPJ já está em uso em outra conta na mesma loja
      const clienteExistenteCPF_CNPJ = await Cliente.findOne({
        where: {
          CPF_CNPJ,
          Lojas_idLoja: idLoja,
          idCliente: { [Op.ne]: idCliente }, // Exclui o cliente atual da verificação
        },
      });

      if (clienteExistenteCPF_CNPJ) {
        res.status(400).json({ message: "O novo CPF ou CNPJ já está em uso nesta loja." });
        return;
      }

      // Atualizar o e-mail se não estiver em uso
      cliente.CPF_CNPJ = CPF_CNPJ;
    }




      cliente.Nome = Nome || cliente.Nome;
      //cliente.CPF_CNPJ = CPF_CNPJ || cliente.CPF_CNPJ;
      cliente.Rua = Rua || cliente.Rua;
      cliente.Numero = Numero || cliente.Numero;
      cliente.Bairro = Bairro || cliente.Bairro;
      cliente.Cidade = Cidade || cliente.Cidade;
      cliente.Celular = Celular || cliente.Celular;
      cliente.Celular2 = Celular2 || cliente.Celular2;
      cliente.RG = RG || cliente.RG;
      cliente.Tipo_Cliente = Tipo_Cliente || cliente.Tipo_Cliente;
      //cliente.Email = Email || cliente.Email;
      cliente.Grupo = Grupo || cliente.Grupo;
      cliente.Data_Nascimento = Data_Nascimento || cliente.Data_Nascimento;
      cliente.Sexo = Sexo || cliente.Sexo;
      cliente.Estado_Civil = Estado_Civil || cliente.Estado_Civil;
      await cliente.save();
      //res.status(200).json(cliente);
      res.status(200).json({ message: 'Registro atualizado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar registro.' });
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
