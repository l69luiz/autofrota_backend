//src/controllers/vendasController.ts
import { Request, Response } from 'express';
import { Venda } from '../models/vendas'; // Modelo de Venda
import { Op } from 'sequelize';
import { Cliente } from '../models/clientes'; // Importando o model Cliente
import { Usuario } from '../models/usuarios'; // Importando o model Usuario
import { Veiculo } from '../models/veiculos'; // Importando o model Veiculo

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idempresaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todas as vendas da empresa com filtros
export const getVendasFilter = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Pega o ID da empresa do usuário autenticado
    const idEmpresa = req.user?.idempresaToken;

    // Pega os parâmetros da URL (para filtros e paginação)
    const { _page, _limit, data_like, cliente_like } = req.query;

    // Converte _page e _limit para inteiros e define valores padrão caso sejam inválidos
    const page = !isNaN(parseInt(_page as string)) ? parseInt(_page as string, 10) : 1;
    const limit = !isNaN(parseInt(_limit as string)) ? parseInt(_limit as string, 10) : 10;
    const offset = (page - 1) * limit;

    // Constrói a condição de filtro para a data e cliente, se fornecido
    const whereCondition = {
      Empresas_idEmpresa: idEmpresa, // Filtro pela empresa do usuário logado
      ...(data_like && {
        Data_Venda: {
          [Op.like]: `%${data_like}%`,
        },
      }),
      ...(cliente_like && {
        '$cliente.Nome$': {
          [Op.like]: `%${cliente_like}%`,
        },
      }),
    };

    // Faz a consulta ao banco de dados com paginação e filtro
    const vendas = await Venda.findAndCountAll({
      where: whereCondition,
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'usuario' },
        { model: Veiculo, as: 'veiculo' },
      ],
      limit: limit,
      offset: offset,
    });

    // Verifica se há vendas e envia a resposta apropriada
    if (vendas.rows.length === 0) {
      res.status(404).json({ message: 'Não há vendas cadastradas na sua empresa.' });
    } else {
      // Envia a lista de vendas com a contagem total, paginação e dados
      res.status(200).json({
        data: vendas.rows,
        totalCount: vendas.count,
        page,
        limit,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar vendas' });
    //console.log(error);
  }
};

// Função para criar uma nova venda na empresa do usuário
export const createVenda = [
  //checkPermission('Vendas', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const {
        Data_Venda,
        Valor_Venda,
        Margem_Minima,
        Desconto_Venda,
        Forma_Pagamento,
        Clientes_idCliente,
        Usuarios_idUsuario,
        Veiculo_idVeiculo,
      } = req.body;

      // Verificar se o Cliente existe
      const clienteExistente = await Cliente.findOne({ where: { idCliente: Clientes_idCliente, Empresas_idEmpresa: req.user?.idempresaToken } });
      if (!clienteExistente) {
        res.status(404).json({ message: "Cliente não encontrado nesta empresa." });
        return;
      }

      // Verificar se o Usuário existe
      const usuarioExistente = await Usuario.findOne({ where: { idUsuario: Usuarios_idUsuario, Empresas_idEmpresa: req.user?.idempresaToken } });
      if (!usuarioExistente) {
        res.status(404).json({ message: "Usuário não encontrado nesta empresa." });
        return;
      }

      // Verificar se o Veículo existe
      const veiculoExistente = await Veiculo.findOne({ where: { idVeiculo: Veiculo_idVeiculo, Empresas_idEmpresa: req.user?.idempresaToken } });
      if (!veiculoExistente) {
        res.status(404).json({ message: "Veículo não encontrado nesta empresa." });
        return;
      }

      // Criar a nova venda
      const venda = await Venda.create({
        Data_Venda,
        Valor_Venda,
        Margem_Minima,
        Desconto_Venda,
        Forma_Pagamento,
        Clientes_idCliente,
        Usuarios_idUsuario,
        Veiculo_idVeiculo,
      });

      res.status(201).json(venda);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar registro' });
    }
  },
];

// Função para excluir uma venda da empresa do usuário
export const deleteVenda = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idVenda } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const venda = await Venda.findOne({
        where: { idVenda },
        include: [
          { model: Cliente, as: 'cliente', where: { Empresas_idEmpresa: idEmpresa } },
        ],
      });
      if (!venda) {
        res.status(404).json({ message: 'Venda não encontrada nesta empresa' });
        return;
      }

      await venda.destroy();
      res.status(200).json({ message: 'Venda excluída com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir venda' });
    }
  },
];

// Função para atualizar os dados de uma venda na empresa do usuário
export const updateVenda = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idVenda } = req.params;
      const {
        Data_Venda,
        Valor_Venda,
        Margem_Minima,
        Desconto_Venda,
        Forma_Pagamento,
        Clientes_idCliente,
        Usuarios_idUsuario,
        Veiculo_idVeiculo,
      } = req.body;

      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const venda = await Venda.findOne({
        where: { idVenda },
        include: [
          { model: Cliente, as: 'cliente', where: { Empresas_idEmpresa: idEmpresa } },
        ],
      });
      if (!venda) {
        res.status(404).json({ message: 'Venda não encontrada nesta empresa' });
        return;
      }

      // Verificar se o Cliente foi alterado
      if (Clientes_idCliente && Clientes_idCliente !== venda.Clientes_idCliente) {
        const clienteExistente = await Cliente.findOne({ where: { idCliente: Clientes_idCliente, Empresas_idEmpresa: idEmpresa } });
        if (!clienteExistente) {
          res.status(404).json({ message: "Cliente não encontrado nesta empresa." });
          return;
        }
        venda.Clientes_idCliente = Clientes_idCliente;
      }

      // Verificar se o Usuário foi alterado
      if (Usuarios_idUsuario && Usuarios_idUsuario !== venda.Usuarios_idUsuario) {
        const usuarioExistente = await Usuario.findOne({ where: { idUsuario: Usuarios_idUsuario, Empresas_idEmpresa: idEmpresa } });
        if (!usuarioExistente) {
          res.status(404).json({ message: "Usuário não encontrado nesta empresa." });
          return;
        }
        venda.Usuarios_idUsuario = Usuarios_idUsuario;
      }

      // Verificar se o Veículo foi alterado
      if (Veiculo_idVeiculo && Veiculo_idVeiculo !== venda.Veiculo_idVeiculo) {
        const veiculoExistente = await Veiculo.findOne({ where: { idVeiculo: Veiculo_idVeiculo, Empresas_idEmpresa: idEmpresa } });
        if (!veiculoExistente) {
          res.status(404).json({ message: "Veículo não encontrado nesta empresa." });
          return;
        }
        venda.Veiculo_idVeiculo = Veiculo_idVeiculo;
      }

      venda.Data_Venda = Data_Venda || venda.Data_Venda;
      venda.Valor_Venda = Valor_Venda || venda.Valor_Venda;
      venda.Margem_Minima = Margem_Minima || venda.Margem_Minima;
      venda.Desconto_Venda = Desconto_Venda || venda.Desconto_Venda;
      venda.Forma_Pagamento = Forma_Pagamento || venda.Forma_Pagamento;
      await venda.save();
      res.status(200).json({ message: 'Registro atualizado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar registro.' });
    }
  },
];

// Função para buscar venda por ID na empresa do usuário
export const getVendaById = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idVenda } = req.params;
      const idEmpresa = req.user?.idempresaToken; // ID da empresa do usuário logado
      const venda = await Venda.findOne({
        where: { idVenda },
        include: [
          { model: Cliente, as: 'cliente', where: { Empresas_idEmpresa: idEmpresa } },
          { model: Usuario, as: 'usuario' },
          { model: Veiculo, as: 'veiculo' },
        ],
      });
      if (!venda) {
        res.status(404).json({ message: "Venda não encontrada com este ID nesta empresa." });
        return;
      }

      res.status(200).json(venda);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar venda pelo ID' });
    }
  },
];