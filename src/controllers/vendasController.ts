// src/controllers/vendasController.ts
import { Request, Response } from 'express';
import { Venda } from '../models/vendas'; // Modelo de Venda
import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

// Função para buscar todas as vendas
export const getVendas = [
  checkPermission('Venda', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response) => {
    try {
      const vendas = await Venda.findAll({
        include: ['cliente', 'usuario', 'veiculo'], // Incluindo os relacionamentos com Cliente, Usuario e Veiculo
      });
      res.json(vendas);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar vendas' });
    }
  },
];

// Função para criar uma nova venda
export const createVenda = [
  checkPermission('Venda', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
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
      res.status(500).json({ message: 'Erro ao criar venda' });
      console.log(error);
    }
  },
];

// Função para excluir uma venda
export const deleteVenda = [
  checkPermission('Venda', 'deletar'), // Verifica permissão de deletar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idVenda } = req.params;

      const venda = await Venda.findOne({ where: { idVenda } });
      if (!venda) {
        res.status(404).json({ message: 'Venda não encontrada' });
        return;
      }

      await venda.destroy();
      res.status(200).json({ message: 'Venda excluída com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir venda' });
    }
  },
];

// Função para atualizar os dados de uma venda
export const updateVenda = [
  checkPermission('Venda', 'atualizar'), // Verifica permissão de atualizar
  async (req: Request, res: Response): Promise<void> => {
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

      const venda = await Venda.findOne({ where: { idVenda } });
      if (!venda) {
        res.status(404).json({ message: 'Venda não encontrada' });
        return;
      }

      venda.Data_Venda = Data_Venda || venda.Data_Venda;
      venda.Valor_Venda = Valor_Venda || venda.Valor_Venda;
      venda.Margem_Minima = Margem_Minima || venda.Margem_Minima;
      venda.Desconto_Venda = Desconto_Venda || venda.Desconto_Venda;
      venda.Forma_Pagamento = Forma_Pagamento || venda.Forma_Pagamento;
      venda.Clientes_idCliente = Clientes_idCliente || venda.Clientes_idCliente;
      venda.Usuarios_idUsuario = Usuarios_idUsuario || venda.Usuarios_idUsuario;
      venda.Veiculo_idVeiculo = Veiculo_idVeiculo || venda.Veiculo_idVeiculo;

      await venda.save();
      res.status(200).json(venda);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar venda' });
    }
  },
];

// Função para buscar venda por ID
export const getVendaById = [
  checkPermission('Venda', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idVenda } = req.params;
      const venda = await Venda.findByPk(idVenda, {
        include: ['cliente', 'usuario', 'veiculo'], // Incluindo os relacionamentos
      });

      if (!venda) {
        res.status(404).json({ message: 'Venda não encontrada com este ID' });
        return;
      }

      res.status(200).json(venda);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar venda pelo ID' });
    }
  },
];
