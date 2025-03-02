// src/controllers/clientesController.ts
import { Request, Response } from 'express';
import { Cliente } from '../models/clientes'; // Modelo de Cliente
import { Op } from 'sequelize';

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todos os clientes da empresa com filtros
export const getClientesFilter = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Pega o ID da empresa do usuário autenticado
    const idEmpresa = req.user?.idempresaToken;

    // Pega os parâmetros da URL (para filtros e paginação)
    const { _page, _limit, nome_like } = req.query;

    // Converte _page e _limit para inteiros e define valores padrão caso sejam inválidos
    const page = !isNaN(parseInt(_page as string)) ? parseInt(_page as string, 10) : 1;
    const limit = !isNaN(parseInt(_limit as string)) ? parseInt(_limit as string, 10) : 10;
    const offset = (page - 1) * limit;

    // Constrói a condição de filtro para o nome completo, se fornecido
    const whereCondition = {
      Empresas_idEmpresa: idEmpresa, // Filtro pela empresa do usuário logado
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
      res.status(404).json({ message: 'Não há clientes cadastrados na sua empresa.' });
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

// Função para criar um novo cliente na empresa do usuário
export const createCliente = [
  //checkPermission('Clientes', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const {
        Nome,
        CPF_CNPJ,
        CEP,
        Rua,
        Numero,
        Bairro,
        Estado,
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
        StatusEmpresa

      } = req.body;

      // Verificar se o CPF/CNPJ já existe
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const clienteExistenteCPF_CNPJ = await Cliente.findOne({ where: { CPF_CNPJ, Empresas_idEmpresa: idEmpresa } });
      if (clienteExistenteCPF_CNPJ) {
        res.status(400).json({ message: "CPF/CNPJ já está em uso nesta empresa." });
        return;
      }
      // Verificar se o Email já existe
      const clienteExistenteEmail = await Cliente.findOne({ where: { Email, Empresas_idEmpresa: idEmpresa } });
      if (clienteExistenteEmail) {
        res.status(400).json({ message: "Email já está em uso nesta empresa." });
        return;
      }

      // Criar o novo cliente
      const Empresas_idEmpresa = idEmpresa;
      const cliente = await Cliente.create({
        Nome,
        CPF_CNPJ,
        CEP,
        Rua,
        Numero,
        Bairro,
        Estado,
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
        Empresas_idEmpresa,
        StatusAutoRastrear,
        StatusEmpresa
      });

      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar registro' });
    }
  },
];

// Função para excluir um cliente da empresa do usuário
export const deleteCliente = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idCliente } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
       const cliente = await Cliente.findOne({ where: { idCliente, Empresas_idEmpresa: idEmpresa } });
      if (!cliente) {
        res.status(404).json({ message: 'Cliente não encontrado nesta empresa' });
        return;
      }

      await cliente.destroy();
      res.status(200).json({ message: 'Cliente excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir cliente' });
    }
  },
];

// Função para atualizar os dados de um cliente na empresa do usuário
export const updateCliente = [
   async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idCliente } = req.params;
      const {
        Nome,
        CPF_CNPJ,
        CEP,
        Rua,
        Numero,
        Bairro,
        Estado,
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

      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const cliente = await Cliente.findOne({ where: { idCliente, Empresas_idEmpresa: idEmpresa } });
      if (!cliente) {
        res.status(404).json({ message: 'Cliente não encontrado nesta empresa' });
        return;
      }

    // Verificar se o e-mail foi alterado
    if (Email && Email !== cliente.Email) {
      // Verificar se o novo e-mail já está em uso em outra conta na mesma empresa
      const clienteExistenteEmail = await Cliente.findOne({
        where: {
          Email,
          Empresas_idEmpresa: idEmpresa,
          idCliente: { [Op.ne]: idCliente }, // Exclui o cliente atual da verificação
        },
      });

      if (clienteExistenteEmail) {
        res.status(400).json({ message: "O novo e-mail já está em uso nesta empresa." });
        return;
      }

      // Atualizar o e-mail se não estiver em uso
      cliente.Email = Email;
    }

    // Verificar se o CPF_CNPJ foi alterado
    if (CPF_CNPJ && CPF_CNPJ !== cliente.CPF_CNPJ) {
      // Verificar se o novo CPF_CNPJ já está em uso em outra conta na mesma empresa
      const clienteExistenteCPF_CNPJ = await Cliente.findOne({
        where: {
          CPF_CNPJ,
          Empresas_idEmpresa: idEmpresa,
          idCliente: { [Op.ne]: idCliente }, // Exclui o cliente atual da verificação
        },
      });

      if (clienteExistenteCPF_CNPJ) {
        res.status(400).json({ message: "O novo CPF ou CNPJ já está em uso nesta empresa." });
        return;
      }

      // Atualizar o e-mail se não estiver em uso
      cliente.CPF_CNPJ = CPF_CNPJ;
    }

      cliente.Nome = Nome || cliente.Nome;
      cliente.CEP = CEP || cliente.CEP;
      cliente.Rua = Rua || cliente.Rua;
      cliente.Numero = Numero || cliente.Numero;
      cliente.Bairro = Bairro || cliente.Bairro;
      cliente.Estado = Estado || cliente.Estado;
      cliente.Cidade = Cidade || cliente.Cidade;
      cliente.Celular = Celular || cliente.Celular;
      cliente.Celular2 = Celular2 || cliente.Celular2;
      cliente.RG = RG || cliente.RG;
      cliente.Tipo_Cliente = Tipo_Cliente || cliente.Tipo_Cliente;
      cliente.Grupo = Grupo || cliente.Grupo;
      cliente.Data_Nascimento = Data_Nascimento || cliente.Data_Nascimento;
      cliente.Sexo = Sexo || cliente.Sexo;
      cliente.Estado_Civil = Estado_Civil || cliente.Estado_Civil;
      await cliente.save();
        res.status(200).json({ message: 'Registro atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar registro.' });
    }
  },
];

// Função para buscar cliente por CPF/CNPJ na empresa do usuário
export const getClienteByCPF_CNPJ = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { CPF_CNPJ } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const cliente = await Cliente.findOne({ where: { CPF_CNPJ, Empresas_idEmpresa: idEmpresa } });
      if (!cliente) {
        res.status(404).json({ message: "Cliente não encontrado com este CPF/CNPJ nesta empresa." });
        return;
      }
        res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar cliente pelo CPF/CNPJ' });
    }
  },
];

// Função para buscar cliente por ID na empresa do usuário
export const getClienteById = [
   async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idCliente } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const cliente = await Cliente.findOne({ where: { idCliente, Empresas_idEmpresa: idEmpresa } });
      if (!cliente) {
        res.status(404).json({ message: "Cliente não encontrado com este ID nesta empresa." });
        return;
      }

      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar cliente pelo ID' });
    }
  },
];
