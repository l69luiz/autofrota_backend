// src/controllers/veiculoController.ts
import { Request, Response } from 'express';
import { Veiculo } from '../models/veiculos'; // Modelo de Veículo
import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

// Função para buscar todos os veículos
export const getVeiculos = [
  checkPermission('Veiculo', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response) => {
    try {
      const veiculos = await Veiculo.findAll();
      res.json(veiculos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar veículos' });
    }
  },
];

// Função para criar um novo veículo
export const createVeiculo = [
  checkPermission('Veiculo', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        Placa_Veiculo,
        Chassi,
        Renavan,
        Cor,
        Nr_Motor,
        Marca,
        Modelo,
        Ano_fab,
        Ano_mod,
        Nr_portas,
        CPF_CNPJ_Prop,
        Pot_Motor,
        Km_inicial,
        Ar_cond,
        Vidro_elet,
        Multimidia,
        Sensor_Re,
        Vr_PadraoAluguel,
        Trava_Elet,
        Alarme,
      } = req.body;

      // Verificar se a placa já existe
      const placaExistente = await Veiculo.findOne({ where: { Placa_Veiculo } });
      if (placaExistente) {
        res.status(400).json({ message: "A placa já está em uso." });
        return;
      }

      // Criar o novo veículo
      const veiculo = await Veiculo.create({
        Placa_Veiculo,
        Chassi,
        Renavan,
        Cor,
        Nr_Motor,
        Marca,
        Modelo,
        Ano_fab,
        Ano_mod,
        Nr_portas,
        CPF_CNPJ_Prop,
        Pot_Motor,
        Km_inicial,
        Ar_cond,
        Vidro_elet,
        Multimidia,
        Sensor_Re,
        Vr_PadraoAluguel,
        Trava_Elet,
        Alarme,
      });

      res.status(201).json(veiculo);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar veículo' });
    }
  },
];

// Função para excluir um veículo
export const deleteVeiculo = [
  checkPermission('Veiculo', 'deletar'), // Verifica permissão de deletar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idVeiculo } = req.params;

      const veiculo = await Veiculo.findOne({ where: { idVeiculo } });
      if (!veiculo) {
        res.status(404).json({ message: 'Veículo não encontrado' });
        return;
      }

      await veiculo.destroy();
      res.status(200).json({ message: 'Veículo excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir veículo' });
    }
  },
];

// Função para atualizar os dados de um veículo
export const updateVeiculo = [
  checkPermission('Veiculo', 'atualizar'), // Verifica permissão de atualizar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idVeiculo } = req.params;
      const {
        Placa_Veiculo,
        Chassi,
        Renavan,
        Cor,
        Nr_Motor,
        Marca,
        Modelo,
        Ano_fab,
        Ano_mod,
        Nr_portas,
        CPF_CNPJ_Prop,
        Pot_Motor,
        Km_inicial,
        Ar_cond,
        Vidro_elet,
        Multimidia,
        Sensor_Re,
        Vr_PadraoAluguel,
        Trava_Elet,
        Alarme,
      } = req.body;

      const veiculo = await Veiculo.findOne({ where: { idVeiculo } });
      if (!veiculo) {
        res.status(404).json({ message: 'Veículo não encontrado' });
        return;
      }

      veiculo.Placa_Veiculo = Placa_Veiculo || veiculo.Placa_Veiculo;
      veiculo.Chassi = Chassi || veiculo.Chassi;
      veiculo.Renavan = Renavan || veiculo.Renavan;
      veiculo.Cor = Cor || veiculo.Cor;
      veiculo.Nr_Motor = Nr_Motor || veiculo.Nr_Motor;
      veiculo.Marca = Marca || veiculo.Marca;
      veiculo.Modelo = Modelo || veiculo.Modelo;
      veiculo.Ano_fab = Ano_fab || veiculo.Ano_fab;
      veiculo.Ano_mod = Ano_mod || veiculo.Ano_mod;
      veiculo.Nr_portas = Nr_portas || veiculo.Nr_portas;
      veiculo.CPF_CNPJ_Prop = CPF_CNPJ_Prop || veiculo.CPF_CNPJ_Prop;
      veiculo.Pot_Motor = Pot_Motor || veiculo.Pot_Motor;
      veiculo.Km_inicial = Km_inicial || veiculo.Km_inicial;
      veiculo.Ar_cond = Ar_cond !== undefined ? Ar_cond : veiculo.Ar_cond;
      veiculo.Vidro_elet = Vidro_elet !== undefined ? Vidro_elet : veiculo.Vidro_elet;
      veiculo.Multimidia = Multimidia !== undefined ? Multimidia : veiculo.Multimidia;
      veiculo.Sensor_Re = Sensor_Re !== undefined ? Sensor_Re : veiculo.Sensor_Re;
      veiculo.Vr_PadraoAluguel = Vr_PadraoAluguel || veiculo.Vr_PadraoAluguel;
      veiculo.Trava_Elet = Trava_Elet !== undefined ? Trava_Elet : veiculo.Trava_Elet;
      veiculo.Alarme = Alarme !== undefined ? Alarme : veiculo.Alarme;

      await veiculo.save();
      res.status(200).json(veiculo);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar veículo' });
    }
  },
];

// Função para buscar veículo por placa
export const getVeiculoByPlaca = [
  checkPermission('Veiculo', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { Placa_Veiculo } = req.params;
      const veiculo = await Veiculo.findOne({ where: { Placa_Veiculo } });

      if (!veiculo) {
        res.status(404).json({ message: "Veículo não encontrado com esta placa." });
        return;
      }

      res.status(200).json(veiculo);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar veículo pela placa' });
    }
  },
];

// Função para buscar veículo por ID
export const getVeiculoById = [
  checkPermission('Veiculo', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idVeiculo } = req.params;
      const veiculo = await Veiculo.findByPk(idVeiculo);

      if (!veiculo) {
        res.status(404).json({ message: "Veículo não encontrado com este ID." });
        return;
      }

      res.status(200).json(veiculo);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar veículo pelo ID' });
    }
  },
];
