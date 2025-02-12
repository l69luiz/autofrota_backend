import { Request, Response } from 'express';
import { Manutencao } from '../models/manutencoes'; // Modelo de Manutenção
import { checkPermission } from '../middlewares/authMiddleware'; // Middleware de permissões
import { Veiculo } from '../models/veiculos';
import { Estoque } from '../models/estoques';
import { Loja } from '../models/lojas';

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

interface ManutencaoComRelacionamentos extends Manutencao {
  veiculo?: {
    idVeiculo: number;
    Placa_Veiculo: string;
    estoque?: {
      idEstoque: number;
      loja?: {
        idLoja: number;
      };
    };
  };
}






// Função para buscar todas as manutenções da loja do usuário
export const getManutencoes = [
  checkPermission('Manutencao', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca manutenções filtrando pela loja associada ao veículo
      const manutencoes = await Manutencao.findAll({
        include: [
          {
            model: Veiculo,
            as: 'veiculo', // Alias usado no relacionamento
            include: [
              {
                model: Estoque,
                as: 'estoque', // Alias usado no relacionamento
                include: [
                  {
                    model: Loja,
                    as: 'loja', // Alias usado no relacionamento
                    where: { idLoja: idLoja }, // Filtra pela loja do estoque
                  },
                ],
              },
            ],
          },
        ],
      });

      // Filtra manutenções cujo array de veiculo e loja não seja null
      const manutencoesFiltradas = manutencoes.filter((manutencao: any) => manutencao.veiculo.estoque !== null);

      if (manutencoesFiltradas.length === 0) {
        res.status(404).json({ message: 'Não há manutenções cadastradas na sua loja.' });
      } else {
        res.json(manutencoesFiltradas);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar manutenções' });
    }
  },
];

// Função para criar uma nova manutenção
export const createManutencao = [
  checkPermission('Manutencao', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        Tipo_Manut,
        Km_Manut,
        Pecas_Manut,
        Servico_Manut,
        Nr_NF_Manut,
        Oficina_Manut,
        Vr_Manut,
        Veiculo_idVeiculo,
        Data_Manutencao,
        Usuarios_idUsuario,
      } = req.body;

      // Criar a nova manutenção
      const manutencao = await Manutencao.create({
        Tipo_Manut,
        Km_Manut,
        Pecas_Manut,
        Servico_Manut,
        Nr_NF_Manut,
        Oficina_Manut,
        Vr_Manut,
        Veiculo_idVeiculo,
        Data_Manutencao,
        Usuarios_idUsuario,
      });

      res.status(201).json(manutencao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar manutenção' });
      console.log(error);
    }
  },
];

// Função para excluir uma manutenção da loja do usuário
export const deleteManutencao = [
  checkPermission('Manutencao', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idManutencao } = req.params; // ID da manutenção que será excluída
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca a manutenção, incluindo o veículo e o estoque associado
      const manutencao = await Manutencao.findOne({
        where: { idManutencao },
        include: [
          {
            model: Veiculo,
            as: 'veiculo',
            include: [
              {
                model: Estoque,
                as: 'estoque',
                include: [
                  {
                    model: Loja,
                    as: 'loja',
                    where: { idLoja: idLoja }, // Filtra pela loja do estoque
                  },
                ],
              },
            ],
          },
        ],
      }) as ManutencaoComRelacionamentos | null; // Faz o casting para a interface

      // Verifique se o retorno da consulta existe e se os relacionamentos estão presentes
      if (!manutencao || !manutencao.veiculo || !manutencao.veiculo.estoque || !manutencao.veiculo.estoque.loja) {
        res.status(404).json({ message: 'Manutenção não encontra ou você não tem permissão para excluí-la.' });
        return;
      }

      // Acessando corretamente o estoque e veículo
      //const estoque = manutencao.veiculo.estoque;
      //const veiculo = manutencao.veiculo;

      //console.log(`Estoque: ${estoque.idEstoque}, Veículo: ${veiculo.Placa_Veiculo}`);

      // Se a manutenção foi encontrada e pertence à loja, agora você pode excluí-la
      await manutencao.destroy();

      res.status(200).json({ message: 'Manutenção excluída com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir manutenção:', error);
      res.status(500).json({ message: 'Erro interno ao excluir manutenção.' });
    }
  },
];


// Função para atualizar os dados de uma manutenção
export const updateManutencao = [
  //checkPermission('Manutencao', 'atualizar'), // Verifica permissão de atualizar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idManutencao } = req.params;
      const {
        Tipo_Manut,
        Km_Manut,
        Pecas_Manut,
        Servico_Manut,
        Nr_NF_Manut,
        Oficina_Manut,
        Vr_Manut,
        Veiculo_idVeiculo,
        Data_Manutencao,
        Usuarios_idUsuario,
      } = req.body;

      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca a manutenção, incluindo o veículo e o estoque associado
      const manutencao = await Manutencao.findOne({
        where: { idManutencao },
        include: [
          {
            model: Veiculo,
            as: 'veiculo',
            include: [
              {
                model: Estoque,
                as: 'estoque',
                include: [
                  {
                    model: Loja,
                    as: 'loja',
                    where: { idLoja: idLoja }, // Filtra pela loja do estoque
                  },
                ],
              },
            ],
          },
        ],
      }) as ManutencaoComRelacionamentos | null; // Faz o casting para a interface


       // Verifique se o retorno da consulta existe e se os relacionamentos estão presentes
       if (!manutencao || !manutencao.veiculo || !manutencao.veiculo.estoque || !manutencao.veiculo.estoque.loja) {
        res.status(404).json({ message: 'Manutenção não encontra ou você não tem permissão para atualizá-la.' });
        return;
      }

      // Atualiza os dados da manutenção
      manutencao.Tipo_Manut = Tipo_Manut || manutencao.Tipo_Manut;
      manutencao.Km_Manut = Km_Manut || manutencao.Km_Manut;
      manutencao.Pecas_Manut = Pecas_Manut || manutencao.Pecas_Manut;
      manutencao.Servico_Manut = Servico_Manut || manutencao.Servico_Manut;
      manutencao.Nr_NF_Manut = Nr_NF_Manut || manutencao.Nr_NF_Manut;
      manutencao.Oficina_Manut = Oficina_Manut || manutencao.Oficina_Manut;
      manutencao.Vr_Manut = Vr_Manut || manutencao.Vr_Manut;
      manutencao.Veiculo_idVeiculo = Veiculo_idVeiculo || manutencao.Veiculo_idVeiculo;
      manutencao.Data_Manutencao = Data_Manutencao || manutencao.Data_Manutencao;
      manutencao.Usuarios_idUsuario = Usuarios_idUsuario || manutencao.Usuarios_idUsuario;

      // Salva as alterações
      await manutencao.save();
      res.status(200).json(manutencao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar manutenção' });
    }
  },
];

// Função para buscar manutenção por ID da loja do usuário
export const getManutencaoById = [
  //checkPermission('Manutencao', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idManutencao } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca a manutenção, incluindo o veículo e o estoque associado
      const manutencao = await Manutencao.findOne({
        where: { idManutencao },
        include: [
          {
            model: Veiculo,
            as: 'veiculo',
            include: [
              {
                model: Estoque,
                as: 'estoque',
                include: [
                  {
                    model: Loja,
                    as: 'loja',
                    where: { idLoja: idLoja }, // Filtra pela loja do estoque
                  },
                ],
              },
            ],
          },
        ],
      }) as ManutencaoComRelacionamentos | null; // Faz o casting para a interface


       // Verifique se o retorno da consulta existe e se os relacionamentos estão presentes
       if (!manutencao || !manutencao.veiculo || !manutencao.veiculo.estoque || !manutencao.veiculo.estoque.loja) {
        res.status(404).json({ message: 'Manutenção não encontra ou você não tem permissão para vizualizá-la.' });
        return;
      }

      // Retorna a manutenção encontrada
      res.status(200).json(manutencao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar manutenção pelo ID' });
    }
  },
];
