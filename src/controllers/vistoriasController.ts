// src/controllers/vistoriasController.ts
import { Request, Response } from 'express';
import { Vistoria } from '../models/vistorias'; // Modelo de Vistoria
import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões
import { Veiculo } from '../models/veiculos';
import { Usuario } from '../models/usuarios';
import { Contrato } from '../models/contratos';

// Função para buscar todas as vistorias
export const getVistorias = [
  checkPermission('Vistoria', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response) => {
    try {
      const vistorias = await Vistoria.findAll({
        include: [
          { model: Veiculo, as: 'veiculo' }, // Inclui os dados do veículo
          { model: Usuario, as: 'usuario' }, // Inclui os dados do usuário
          { model: Contrato, as: 'contrato' } // Inclui os dados do contrato
        ]
      });
      res.json(vistorias);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar vistorias' });
      console.log(error);
    }
  },
];

// Função para criar uma nova vistoria
export const createVistoria = [
  checkPermission('Vistoria', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        Dt_Vistoria,
        Tipo_Vistoria,
        Retrovisor_Dir,
        Retrovisor_Esq,
        Parabrisa,
        Vidros_Diant_Dir,
        Vidros_Diant_Esq,
        Vidros_Tras_Dir,
        Vidros_Tras_Esq,
        Vidros_Traseiro,
        Antena,
        Farois_Lanternas,
        Luzes,
        Parachoque_Tras,
        ParachoqueDian,
        Limpadores_Vidro,
        Painel,
        Plasticos,
        Cintos_seg,
        Chave_Roda_Mac_triangulo,
        Freio_Servico,
        Pneus,
        Rodas,
        Combustivel,
        Bancos,
        Outros,
        Veiculo_idVeiculo,
        Usuarios_idUsuario,
        Contratos_idContrato1
      } = req.body;

      // Criar a nova vistoria
      const vistoria = await Vistoria.create({
        Dt_Vistoria,
        Tipo_Vistoria,
        Retrovisor_Dir,
        Retrovisor_Esq,
        Parabrisa,
        Vidros_Diant_Dir,
        Vidros_Diant_Esq,
        Vidros_Tras_Dir,
        Vidros_Tras_Esq,
        Vidros_Traseiro,
        Antena,
        Farois_Lanternas,
        Luzes,
        Parachoque_Tras,
        ParachoqueDian,
        Limpadores_Vidro,
        Painel,
        Plasticos,
        Cintos_seg,
        Chave_Roda_Mac_triangulo,
        Freio_Servico,
        Pneus,
        Rodas,
        Combustivel,
        Bancos,
        Outros,
        Veiculo_idVeiculo,
        Usuarios_idUsuario,
        Contratos_idContrato1
      });

      res.status(201).json(vistoria);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar vistoria' });
    }
  },
];

// Função para excluir uma vistoria
export const deleteVistoria = [
  checkPermission('Vistoria', 'deletar'), // Verifica permissão de deletar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idVistoria } = req.params;

      const vistoria = await Vistoria.findOne({ where: { idVistoria } });
      if (!vistoria) {
        res.status(404).json({ message: 'Vistoria não encontrada' });
        return;
      }

      await vistoria.destroy();
      res.status(200).json({ message: 'Vistoria excluída com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir vistoria' });
    }
  },
];

// Função para atualizar os dados de uma vistoria
export const updateVistoria = [
  checkPermission('Vistoria', 'atualizar'), // Verifica permissão de atualizar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idVistoria } = req.params;
      const {
        Dt_Vistoria,
        Tipo_Vistoria,
        Retrovisor_Dir,
        Retrovisor_Esq,
        Parabrisa,
        Vidros_Diant_Dir,
        Vidros_Diant_Esq,
        Vidros_Tras_Dir,
        Vidros_Tras_Esq,
        Vidros_Traseiro,
        Antena,
        Farois_Lanternas,
        Luzes,
        Parachoque_Tras,
        ParachoqueDian,
        Limpadores_Vidro,
        Painel,
        Plasticos,
        Cintos_seg,
        Chave_Roda_Mac_triangulo,
        Freio_Servico,
        Pneus,
        Rodas,
        Combustivel,
        Bancos,
        Outros
      } = req.body;

      const vistoria = await Vistoria.findOne({ where: { idVistoria } });
      if (!vistoria) {
        res.status(404).json({ message: 'Vistoria não encontrada' });
        return;
      }

      vistoria.Dt_Vistoria = Dt_Vistoria || vistoria.Dt_Vistoria;
      vistoria.Tipo_Vistoria = Tipo_Vistoria || vistoria.Tipo_Vistoria;
      vistoria.Retrovisor_Dir = Retrovisor_Dir || vistoria.Retrovisor_Dir;
      vistoria.Retrovisor_Esq = Retrovisor_Esq || vistoria.Retrovisor_Esq;
      vistoria.Parabrisa = Parabrisa || vistoria.Parabrisa;
      vistoria.Vidros_Diant_Dir = Vidros_Diant_Dir || vistoria.Vidros_Diant_Dir;
      vistoria.Vidros_Diant_Esq = Vidros_Diant_Esq || vistoria.Vidros_Diant_Esq;
      vistoria.Vidros_Tras_Dir = Vidros_Tras_Dir || vistoria.Vidros_Tras_Dir;
      vistoria.Vidros_Tras_Esq = Vidros_Tras_Esq || vistoria.Vidros_Tras_Esq;
      vistoria.Vidros_Traseiro = Vidros_Traseiro || vistoria.Vidros_Traseiro;
      vistoria.Antena = Antena || vistoria.Antena;
      vistoria.Farois_Lanternas = Farois_Lanternas || vistoria.Farois_Lanternas;
      vistoria.Luzes = Luzes || vistoria.Luzes;
      vistoria.Parachoque_Tras = Parachoque_Tras || vistoria.Parachoque_Tras;
      vistoria.ParachoqueDian = ParachoqueDian || vistoria.ParachoqueDian;
      vistoria.Limpadores_Vidro = Limpadores_Vidro || vistoria.Limpadores_Vidro;
      vistoria.Painel = Painel || vistoria.Painel;
      vistoria.Plasticos = Plasticos || vistoria.Plasticos;
      vistoria.Cintos_seg = Cintos_seg || vistoria.Cintos_seg;
      vistoria.Chave_Roda_Mac_triangulo = Chave_Roda_Mac_triangulo || vistoria.Chave_Roda_Mac_triangulo;
      vistoria.Freio_Servico = Freio_Servico || vistoria.Freio_Servico;
      vistoria.Pneus = Pneus || vistoria.Pneus;
      vistoria.Rodas = Rodas || vistoria.Rodas;
      vistoria.Combustivel = Combustivel || vistoria.Combustivel;
      vistoria.Bancos = Bancos || vistoria.Bancos;
      vistoria.Outros = Outros || vistoria.Outros;

      await vistoria.save();
      res.status(200).json(vistoria);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar vistoria' });
    }
  },
];

// Função para buscar vistoria por ID
export const getVistoriaById = [
  checkPermission('Vistoria', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idVistoria } = req.params;
      const vistoria = await Vistoria.findByPk(idVistoria, {
        include: [
          { model: Veiculo, as: 'veiculo' },
          { model: Usuario, as: 'usuario' },
          { model: Contrato, as: 'contrato' }
        ]
      });

      if (!vistoria) {
        res.status(404).json({ message: "Vistoria não encontrada com este ID." });
        return;
      }

      res.status(200).json(vistoria);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar vistoria pelo ID' });
    }
  },
];
