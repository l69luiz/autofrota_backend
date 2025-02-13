import { Request, Response } from 'express';
import { Permissoes } from '../models/permissoes'; // Modelo de Permissões
import { Usuario } from '../models/usuarios'; // Modelo de Usuario
import { Loja } from '../models/lojas'; // Modelo de Loja

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todas as permissões da loja do usuário
export const getPermissoes = [
  // checkPermission('Permissoes', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response) => {
    try {
      const idUsuario = req.user?.idUserToken; // ID do usuário logado
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca permissões filtrando pelo usuário logado e pela loja associada ao usuário
      const permissoes = await Permissoes.findAll({
        where: { Usuarios_idUsuario: idUsuario },
        include: [
          {
            model: Usuario,
            as: 'usuario',
            where: { idUsuario: idUsuario },
          },
          {
            model: Loja,
            as: 'loja',
            where: { idLoja: idLoja }, // Filtra pela loja associada ao usuário
          },
        ],
      });

      if (permissoes.length === 0) {
        res.status(404).json({ message: 'Não há permissões cadastradas para o usuário nesta loja.' });
      } else {
        res.json(permissoes);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar permissões' });
    }
  },
];

// Função para criar uma nova permissão
export const createPermissao = [
  // checkPermission('Permissoes', 'criar'), // Verifica permissão de criação
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { NomeTabela, ler, atualizar, criar, deletar, Usuarios_idUsuario } = req.body;

      // Criar a nova permissão
      const permissao = await Permissoes.create({
        NomeTabela,
        ler,
        atualizar,
        criar,
        deletar,
        Usuarios_idUsuario,
      });

      res.status(201).json(permissao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar permissão' });
    }
  },
];

// Função para excluir uma permissão da loja do usuário
export const deletePermissao = [
  // checkPermission('Permissoes', 'deletar'), // Verifica permissão de deletar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idPermissoes } = req.params; // ID da permissão que será excluída
      const idUsuario = req.user?.idUserToken; // ID do usuário logado
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca a permissão associada ao usuário e à loja
      const permissao = await Permissoes.findOne({
        where: { idPermissoes, Usuarios_idUsuario: idUsuario },
        include: [
          {
            model: Loja,
            as: 'loja',
            where: { idLoja: idLoja }, // Filtra pela loja associada ao usuário
          },
        ],
      });

      if (!permissao) {
        res.status(404).json({ message: 'Permissão não encontrada ou você não tem permissão para excluí-la nesta loja.' });
        return;
      }

      // Exclui a permissão
      await permissao.destroy();
      res.status(200).json({ message: 'Permissão excluída com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir permissão' });
    }
  },
];

// Função para atualizar uma permissão da loja do usuário
export const updatePermissao = [
  // checkPermission('Permissoes', 'atualizar'), // Verifica permissão de atualizar
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idPermissoes } = req.params;
      const { NomeTabela, ler, atualizar, criar, deletar } = req.body;
      const idUsuario = req.user?.idUserToken; // ID do usuário logado
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Busca a permissão associada ao usuário e à loja
      const permissao = await Permissoes.findOne({
        where: { idPermissoes, Usuarios_idUsuario: idUsuario },
        include: [
          {
            model: Loja,
            as: 'loja',
            where: { idLoja: idLoja }, // Filtra pela loja associada ao usuário
          },
        ],
      });

      if (!permissao) {
        res.status(404).json({ message: 'Permissão não encontrada ou você não tem permissão para atualizá-la nesta loja.' });
        return;
      }

      // Atualiza os dados da permissão se fornecidos, ou mantém os existentes
      permissao.NomeTabela = NomeTabela || permissao.NomeTabela;
      permissao.ler = ler || permissao.ler;
      permissao.atualizar = atualizar || permissao.atualizar;
      permissao.criar = criar || permissao.criar;
      permissao.deletar = deletar || permissao.deletar;

      // Salva as alterações
      await permissao.save();
      res.status(200).json(permissao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar permissão' });
    }
  },
];


// Função para buscar pagamento por ID na loja do usuário
export const getPermissaoById = [
  //checkPermission('Pagamento', 'ler'), // Verifica permissão de leitura
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idPermissao } = req.params;
      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      const permissao = await Permissoes.findOne({ where: { idPermissao, Lojas_idLoja: idLoja } });
      if (!permissao) {
        res.status(404).json({ message: 'Permissão não encontrado nesta loja' });
        return;
      }

      res.status(200).json(permissao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar permissões pelo ID' });
    }
  },
];