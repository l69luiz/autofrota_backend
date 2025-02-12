// src/controllers/contratosController.ts
import { Request, Response } from 'express';
import { Contrato } from '../models/contratos'; // Modelo de Contrato
import { Usuario } from '../models/usuarios';
import { Model } from 'sequelize';
import { Veiculo } from '../models/veiculos';
import { Estoque } from '../models/estoques';
//import { checkPermission } from '../middlewares/authMiddleware'; // Importando o middleware de permissões

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}



// Função para buscar todos os contratos da loja do usuário
export const getContratos = [
  // checkPermission('Contrato', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca contratos filtrando pela loja do estoque do veículo
      const contratos = await Contrato.findAll({
        include: [
          {
            model: Veiculo,
            as: 'veiculo', // Alias usado no relacionamento
            include: [
              {
                model: Estoque,
                as: 'estoque', // Alias usado no relacionamento
                where: { Lojas_idLoja: idLoja }, // Filtra pela loja
              },
            ],
          },
        ],
      });

      // Filtra contratos cujo array de veículos não seja null
      const contratosFiltrados = contratos.filter((contrato: any) => contrato.veiculo !== null);

      if (contratosFiltrados.length === 0) {
        res.status(404).json({ message: 'Não há contratos cadastrados na sua loja.' });
      } else {
        res.json(contratosFiltrados);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar contratos' });
    }
  },
];



// Função para buscar todos os contratos
export const getContratos2 = [
  //checkPermission('Contrato', 'ler'), // Verifica permissão de leitura
  async (req: Request, res: Response) => {
    try {
      const contratos = await Contrato.findAll();
      res.json(contratos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar contratos' });
    }
  },
];

// Função para criar um novo contrato
export const createContrato = [
  //checkPermission('Contrato', 'criar'), // Verifica permissão de criação
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const {
        Dt_inicial,
        Dt_Final,
        Vr_Semanal,
        Vr_Diario,
        Veiculo_idVeiculo,
 
      } = req.body;

      // Criar o novo contrato
      const idUser = req.user?.idUserToken; // ID da loja do usuário logado
      const contrato = await Contrato.create({
        Dt_inicial,
        Dt_Final,
        Vr_Semanal,
        Vr_Diario,
        Veiculo_idVeiculo,
        Usuarios_idUsuario: idUser,
      });

      res.status(201).json(contrato);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar contrato' });
      
    }
  },
];

// Função para excluir um contrato
export const deleteContrato = [
  //checkPermission('Contrato', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idContrato } = req.params; // ID do contrato que será excluído
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca o contrato apenas se o usuário relacionado pertencer à loja do token
      const contrato = await Contrato.findOne({
        where: { idContrato }, // Busca o contrato pelo ID
        include: [
          {
            model: Veiculo,
            as: 'veiculo', // Alias usado no relacionamento
            include: [
              {
                model: Estoque,
                as: 'estoque', // Alias usado no relacionamento
                where: { Lojas_idLoja: idLoja }, // Filtra pela loja
              },
            ],
          },
      ],
      });
      // console.log(contrato);
      // Verifica se o contrato foi encontrado
       if (!contrato || contrato.dataValues.veiculo === null) {
        res.status(404).json({ message: 'Contrato não encontrado ou você não tem permissão para excluí-lo.' });
        return;
      }

      // Exclui o contrato
      await contrato.destroy();
      res.status(200).json({ message: 'Contrato excluído com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir contrato.' });
      //console.log(error);
    }
  },
];


// Função para atualizar os dados de um contrato
export const updateContrato = [
  //checkPermission('Contrato', 'atualizar'), // Verifica permissão de atualizar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idContrato } = req.params;
      const {
        Dt_inicial,
        Dt_Final,
        Vr_Semanal,
        Vr_Diario,
        Veiculo_idVeiculo,
        Usuarios_idUsuario,
      } = req.body;

      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca o contrato se o usuário relacionado pertencer à loja do token
      const contrato = await Contrato.findOne({
        where: { idContrato }, // Busca o contrato pelo ID
        include: [
          {
            model: Veiculo,
            as: 'veiculo', // Alias usado no relacionamento
            include: [
              {
                model: Estoque,
                as: 'estoque', // Alias usado no relacionamento
                where: { Lojas_idLoja: idLoja }, // Filtra pela loja
              },
            ],
          },
      ],
      });
      // console.log(contrato);
      // Verifica se o contrato foi encontrado
       if (!contrato || contrato.dataValues.veiculo === null) {
        res.status(404).json({ message: 'Contrato não encontrado ou você não tem permissão para atualizá-lo.' });
        return;
      }

      // Atualiza os dados do contrato se fornecidos, ou mantém os existentes
      contrato.Dt_inicial = Dt_inicial || contrato.Dt_inicial;
      contrato.Dt_Final = Dt_Final || contrato.Dt_Final;
      contrato.Vr_Semanal = Vr_Semanal || contrato.Vr_Semanal;
      contrato.Vr_Diario = Vr_Diario || contrato.Vr_Diario;
      contrato.Veiculo_idVeiculo = Veiculo_idVeiculo || contrato.Veiculo_idVeiculo;
      contrato.Usuarios_idUsuario = Usuarios_idUsuario || contrato.Usuarios_idUsuario;

      // Salva as alterações
      await contrato.save();
      res.status(200).json(contrato);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar contrato' });
    }
  },
];

// Função para buscar contrato por ID
export const getContratoById = [
  //checkPermission('Contrato', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idContrato } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca o contrato pelo ID, garantindo que ele pertença à loja do usuário
      const contrato = await Contrato.findOne({
        where: { idContrato }, // Busca o contrato pelo ID
        include: [
          {
            model: Veiculo,
            as: 'veiculo', // Alias usado no relacionamento
            include: [
              {
                model: Estoque,
                as: 'estoque', // Alias usado no relacionamento
                where: { Lojas_idLoja: idLoja }, // Filtra pela loja
              },
            ],
          },
      ],
      });
      // console.log(contrato);
      // Verifica se o contrato foi encontrado
       if (!contrato || contrato.dataValues.veiculo === null) {
        res.status(404).json({ message: "Contrato não encontrado ou você não tem permissão para visualizá-lo." });
        return;
      }

      // Retorna o contrato encontrado
      res.status(200).json(contrato);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar contrato pelo ID' });
    }
  },
];

