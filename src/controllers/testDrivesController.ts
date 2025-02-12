// src/controllers/testDrivesController.ts
import { Request, Response } from 'express';
import { TestDrive } from '../models/testDrives'; // Modelo de TestDrive
import { Cliente } from '../models/clientes'; // Modelo de TestDrive
import { Usuario } from '../models/usuarios'; // Modelo de TestDrive
import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

// Função para buscar todos os test drives
export const getTestDrives = [
  checkPermission('TestDrive', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response) => {
    try {
      const testDrives = await TestDrive.findAll({
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['idCliente', 'Nome'], // Exemplo de campos que você quer trazer
          },
          {
            model: Usuario,
            as: 'usuario1',
            attributes: ['idUsuario', 'Nome'],
          },
          {
            model: Usuario,
            as: 'usuario2',
            attributes: ['idUsuario', 'Nome'],
          },
        ],
      });
      res.json(testDrives);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar test drives' });
    }
  },
];

// Função para criar um novo test drive
export const createTestDrive = [
  checkPermission('TestDrive', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { Data_TestDrive, Clientes_idCliente, Usuarios_idUsuarios, Usuarios_idUsuario } = req.body;

      // Verificar se o cliente já tem um test drive marcado para a mesma data
      const testDriveExistente = await TestDrive.findOne({
        where: { Clientes_idCliente, Data_TestDrive },
      });

      if (testDriveExistente) {
        res.status(400).json({ message: "Este cliente já possui um test drive para esta data." });
        return;
      }

      // Criar o novo test drive
      const testDrive = await TestDrive.create({
        Data_TestDrive,
        Clientes_idCliente,
        Usuarios_idUsuarios,
        Usuarios_idUsuario,
      });

      res.status(201).json(testDrive);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar test drive' });
    }
  },
];

// Função para excluir um test drive
export const deleteTestDrive = [
  checkPermission('TestDrive', 'deletar'), // Verifica permissão de deletar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idTestDrive } = req.params;

      const testDrive = await TestDrive.findOne({ where: { idTestDrive } });
      if (!testDrive) {
        res.status(404).json({ message: 'Test drive não encontrado' });
        return;
      }

      await testDrive.destroy();
      res.status(200).json({ message: 'Test drive excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir test drive' });
    }
  },
];

// Função para atualizar os dados de um test drive
export const updateTestDrive = [
  checkPermission('TestDrive', 'atualizar'), // Verifica permissão de atualizar
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idTestDrive } = req.params;
      const { Data_TestDrive, Clientes_idCliente, Usuarios_idUsuarios, Usuarios_idUsuario } = req.body;

      const testDrive = await TestDrive.findOne({ where: { idTestDrive } });
      if (!testDrive) {
        res.status(404).json({ message: 'Test drive não encontrado' });
        return;
      }

      testDrive.Data_TestDrive = Data_TestDrive || testDrive.Data_TestDrive;
      testDrive.Clientes_idCliente = Clientes_idCliente || testDrive.Clientes_idCliente;
      testDrive.Usuarios_idUsuarios = Usuarios_idUsuarios || testDrive.Usuarios_idUsuarios;
      testDrive.Usuarios_idUsuario = Usuarios_idUsuario || testDrive.Usuarios_idUsuario;

      await testDrive.save();
      res.status(200).json(testDrive);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar test drive' });
    }
  },
];

// Função para buscar test drive por ID
export const getTestDriveById = [
  checkPermission('TestDrive', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { idTestDrive } = req.params;
      const testDrive = await TestDrive.findByPk(idTestDrive, {
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['idCliente', 'Nome'],
          },
          {
            model: Usuario,
            as: 'usuario1',
            attributes: ['idUsuario', 'Nome'],
          },
          {
            model: Usuario,
            as: 'usuario2',
            attributes: ['idUsuario', 'Nome'],
          },
        ],
      });

      if (!testDrive) {
        res.status(404).json({ message: "Test drive não encontrado com este ID." });
        return;
      }

      res.status(200).json(testDrive);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar test drive pelo ID' });
    }
  },
];
