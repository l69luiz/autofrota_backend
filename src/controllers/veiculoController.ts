//src/controllers/veiculoController.ts
import { Request, Response } from 'express';
import { Veiculo } from '../models/veiculos'; // Modelo de Veículo
import { Estoque } from '../models/estoques'; // Modelo de Estoque
import { Op } from 'sequelize';

interface CustomRequest extends Request {
  user?: {
    idUserToken: number;
    idlojaToken: number;
    permissoesToken: string[]; // Array de permissões do usuário
  };
}

// Função para buscar todos os veículos da loja com filtros
export const getVeiculosFilter = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Pega o ID da loja do usuário autenticado
    const idLoja = req.user?.idlojaToken;

    // Pega os parâmetros da URL (para filtros e paginação)
    const { _page, _limit, modelo_like, marca_like } = req.query;

    // Converte _page e _limit para inteiros e define valores padrão caso sejam inválidos
    const page = !isNaN(parseInt(_page as string)) ? parseInt(_page as string, 10) : 1;
    const limit = !isNaN(parseInt(_limit as string)) ? parseInt(_limit as string, 10) : 10;
    const offset = (page - 1) * limit;

    // Busca os estoques da loja
    const estoques = await Estoque.findAll({
      where: { Lojas_idLoja: idLoja },
      attributes: ['idEstoque'], // Apenas o ID do estoque é necessário
    });

    // Extrai os IDs dos estoques
    const idsEstoques = estoques.map((estoque) => estoque.idEstoque);

    // Constrói a condição de filtro para o modelo e marca, se fornecidos
    const whereCondition = {
      Estoque_idEstoque: { [Op.in]: idsEstoques }, // Filtra pelos estoques da loja
      ...(modelo_like && {
        Modelo: {
          [Op.like]: `%${modelo_like}%`,
        },
      }),
      ...(marca_like && {
        Marca: {
          [Op.like]: `%${marca_like}%`,
        },
      }),
    };

    // Faz a consulta ao banco de dados com paginação e filtro
    const veiculos = await Veiculo.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      include: [{ model: Estoque, as: 'estoque' }], // Inclui os dados do estoque
    });

    // Verifica se há veículos e envia a resposta apropriada
    if (veiculos.rows.length === 0) {
      res.status(404).json({ message: 'Não há veículos cadastrados na sua loja.' });
    } else {
      // Envia a lista de veículos com a contagem total, paginação e dados
      res.status(200).json({
        data: veiculos.rows,
        totalCount: veiculos.count,
        page,
        limit,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar veículos' });
    console.error(error);
  }
};

// Função para criar um novo veículo no estoque da loja do usuário
export const createVeiculo = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const {
        Placa_Veiculo,
        Chassi,
        Renavan,
        Cor,
        Nr_Motor,
        Marca,
        Modelo,
        StatusVeiculo,
        Ano_fab,
        Ano_mod,
        Nr_portas,
        CPF_CNPJ_Prop,
        Pot_Motor,
        CaminhoImgVeiculo,
        Km_inicial,
        Ar_cond,
        Vidro_elet,
        Multimidia,
        Sensor_Re,
        Vr_PadraoAluguel,
        Trava_Elet,
        Alarme,
        Valor_Entrada,
        Valor_Fipe_Entrada,
        Estoque_idEstoque,
      } = req.body;

      // Verifica se o estoque pertence à loja do usuário
      const idLoja = req.user?.idlojaToken;
      const estoque = await Estoque.findOne({
        where: { idEstoque: Estoque_idEstoque, Lojas_idLoja: idLoja },
      });

      if (!estoque) {
        res.status(400).json({ message: 'Estoque não pertence à sua loja.' });
        return;
      }

      // Verificar se a placa já está em uso em outro veículo na mesma loja
      const veiculoExistentePlaca = await Veiculo.findOne({
        include: [
          {
            model: Estoque,
            as: 'estoque',
            where: { Lojas_idLoja: idLoja },
          },
        ],
        where: { Placa_Veiculo },
      });

      if (veiculoExistentePlaca) {
        res.status(400).json({ message: 'A placa já está em uso nesta loja.' });
        return;
      }

      // Verificar se o chassi já está em uso em outro veículo na mesma loja
      const veiculoExistenteChassi = await Veiculo.findOne({
        include: [
          {
            model: Estoque,
            as: 'estoque',
            where: { Lojas_idLoja: idLoja },
          },
        ],
        where: { Chassi },
      });

      if (veiculoExistenteChassi) {
        res.status(400).json({ message: 'O chassi já está em uso nesta loja.' });
        return;
      }

      // Verificar se o renavan já está em uso em outro veículo na mesma loja
      const veiculoExistenteRenavan = await Veiculo.findOne({
        include: [
          {
            model: Estoque,
            as: 'estoque',
            where: { Lojas_idLoja: idLoja },
          },
        ],
        where: { Renavan },
      });

      if (veiculoExistenteRenavan) {
        res.status(400).json({ message: 'O renavan já está em uso nesta loja.' });
        return;
      }

      // Cria o novo veículo
      const veiculo = await Veiculo.create({
        Placa_Veiculo,
        Chassi,
        Renavan,
        Cor,
        Nr_Motor,
        Marca,
        Modelo,
        StatusVeiculo,
        Ano_fab,
        Ano_mod,
        Nr_portas,
        CPF_CNPJ_Prop,
        Pot_Motor,
        CaminhoImgVeiculo,
        Km_inicial,
        Ar_cond,
        Vidro_elet,
        Multimidia,
        Sensor_Re,
        Vr_PadraoAluguel,
        Trava_Elet,
        Alarme,
        Valor_Entrada,
        Valor_Fipe_Entrada,
        Estoque_idEstoque,
      });

      res.status(201).json(veiculo);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar veículo' });
      console.error(error);
    }
  },
];

// Função para excluir um veículo do estoque da loja do usuário
export const deleteVeiculo = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idVeiculo } = req.params;
      const idLoja = req.user?.idlojaToken;

      // Verifica se o veículo pertence a um estoque da loja do usuário
      const veiculo = await Veiculo.findOne({
        include: [
          {
            model: Estoque,
            as: 'estoque',
            where: { Lojas_idLoja: idLoja },
          },
        ],
        where: { idVeiculo },
      });

      if (!veiculo) {
        res.status(404).json({ message: 'Veículo não encontrado na sua loja.' });
        return;
      }

      await veiculo.destroy();
      res.status(200).json({ message: 'Veículo excluído com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir veículo' });
      console.error(error);
    }
  },
];

// Função para atualizar os dados de um veículo no estoque da loja do usuário
export const updateVeiculo = [
  async (req: CustomRequest, res: Response): Promise<void> => {
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
        StatusVeiculo,
        Ano_fab,
        Ano_mod,
        Nr_portas,
        CPF_CNPJ_Prop,
        Pot_Motor,
        CaminhoImgVeiculo,
        Km_inicial,
        Ar_cond,
        Vidro_elet,
        Multimidia,
        Sensor_Re,
        Vr_PadraoAluguel,
        Trava_Elet,
        Alarme,
        Valor_Entrada,
        Valor_Fipe_Entrada,
        Estoque_idEstoque,
      } = req.body;

      const idLoja = req.user?.idlojaToken; // ID da loja do usuário logado

      // Verifica se o veículo pertence a um estoque da loja do usuário
      const veiculo = await Veiculo.findOne({
        include: [
          {
            model: Estoque,
            as: 'estoque',
            where: { Lojas_idLoja: idLoja },
          },
        ],
        where: { idVeiculo },
      });

      if (!veiculo) {
        res.status(404).json({ message: 'Veículo não encontrado na sua loja.' });
        return;
      }

      // Verificar se a placa do veículo foi alterada
      if (Placa_Veiculo && Placa_Veiculo !== veiculo.Placa_Veiculo) {
        // Verificar se a nova placa já está em uso em outro veículo na mesma loja
        const veiculoExistentePlaca = await Veiculo.findOne({
          include: [
            {
              model: Estoque,
              as: 'estoque',
              where: { Lojas_idLoja: idLoja },
            },
          ],
          where: {
            Placa_Veiculo,
            idVeiculo: { [Op.ne]: idVeiculo }, // Exclui o veículo atual da verificação
          },
        });

        if (veiculoExistentePlaca) {
          res.status(400).json({ message: 'A nova placa já está em uso nesta loja.' });
          return;
        }

        // Atualizar a placa se não estiver em uso
        veiculo.Placa_Veiculo = Placa_Veiculo;
      }

      // Verificar se o chassi foi alterado
      if (Chassi && Chassi !== veiculo.Chassi) {
        // Verificar se o novo chassi já está em uso em outro veículo na mesma loja
        const veiculoExistenteChassi = await Veiculo.findOne({
          include: [
            {
              model: Estoque,
              as: 'estoque',
              where: { Lojas_idLoja: idLoja },
            },
          ],
          where: {
            Chassi,
            idVeiculo: { [Op.ne]: idVeiculo }, // Exclui o veículo atual da verificação
          },
        });

        if (veiculoExistenteChassi) {
          res.status(400).json({ message: 'O novo chassi já está em uso nesta loja.' });
          return;
        }

        // Atualizar o chassi se não estiver em uso
        veiculo.Chassi = Chassi;
      }

      // Verificar se O RENAVAN foi alterado
      if (Renavan && Renavan !== veiculo.Renavan) {
        // Verificar se o RENAVAN já está em uso em outro veículo na mesma loja
        const veiculoExistenteRenavan = await Veiculo.findOne({
          include: [
            {
              model: Estoque,
              as: 'estoque',
              where: { Lojas_idLoja: idLoja },
            },
          ],
          where: {
            Renavan,
            idVeiculo: { [Op.ne]: idVeiculo }, // Exclui o veículo atual da verificação
          },
        });

        if (veiculoExistenteRenavan) {
          res.status(400).json({ message: 'O novo RENAVAM já está em uso nesta loja.' });
          return;
        }

        // Atualizar a placa se não estiver em uso
        veiculo.Renavan = Renavan;
      }




      // Atualizar os demais campos
      veiculo.Cor = Cor || veiculo.Cor;
      veiculo.Nr_Motor = Nr_Motor || veiculo.Nr_Motor;
      veiculo.Marca = Marca || veiculo.Marca;
      veiculo.Modelo = Modelo || veiculo.Modelo;
      veiculo.StatusVeiculo = StatusVeiculo || veiculo.StatusVeiculo;
      veiculo.Ano_fab = Ano_fab || veiculo.Ano_fab;
      veiculo.Ano_mod = Ano_mod || veiculo.Ano_mod;
      veiculo.Nr_portas = Nr_portas || veiculo.Nr_portas;
      veiculo.CPF_CNPJ_Prop = CPF_CNPJ_Prop || veiculo.CPF_CNPJ_Prop;
      veiculo.Pot_Motor = Pot_Motor || veiculo.Pot_Motor;
      veiculo.CaminhoImgVeiculo = CaminhoImgVeiculo || veiculo.CaminhoImgVeiculo;
      veiculo.Km_inicial = Km_inicial || veiculo.Km_inicial;
      veiculo.Ar_cond = Ar_cond || veiculo.Ar_cond;
      veiculo.Vidro_elet = Vidro_elet || veiculo.Vidro_elet;
      veiculo.Multimidia = Multimidia || veiculo.Multimidia;
      veiculo.Sensor_Re = Sensor_Re || veiculo.Sensor_Re;
      veiculo.Vr_PadraoAluguel = Vr_PadraoAluguel || veiculo.Vr_PadraoAluguel;
      veiculo.Trava_Elet = Trava_Elet || veiculo.Trava_Elet;
      veiculo.Alarme = Alarme || veiculo.Alarme;
      veiculo.Valor_Entrada = Valor_Entrada || veiculo.Valor_Entrada;
      veiculo.Valor_Fipe_Entrada = Valor_Fipe_Entrada || veiculo.Valor_Fipe_Entrada;
      veiculo.Estoque_idEstoque = Estoque_idEstoque || veiculo.Estoque_idEstoque;

      await veiculo.save();
      res.status(200).json({ message: 'Veículo atualizado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar veículo.' });
      console.error(error);
    }
  },
];

// Função para buscar veículo por ID no estoque da loja do usuário
export const getVeiculoById = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { idVeiculo } = req.params;
      const idLoja = req.user?.idlojaToken;

      // Verifica se o veículo pertence a um estoque da loja do usuário
      const veiculo = await Veiculo.findOne({
        include: [
          {
            model: Estoque,
            as: 'estoque',
            where: { Lojas_idLoja: idLoja },
          },
        ],
        where: { idVeiculo },
      });

      if (!veiculo) {
        res.status(404).json({ message: 'Veículo não encontrado na sua loja.' });
        return;
      }

      res.status(200).json(veiculo);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar veículo pelo ID' });
      console.error(error);
    }
  },
];


// Função para buscar veículo por ID no estoque da loja do usuário
export const getVeiculoByPlaca = [
  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { Placa_Veiculo } = req.params;
      const idLoja = req.user?.idlojaToken;

      // Verifica se o veículo pertence a um estoque da loja do usuário
      const veiculo = await Veiculo.findOne({
        include: [
          {
            model: Estoque,
            as: 'estoque',
            where: { Lojas_idLoja: idLoja },
          },
        ],
        where: { Placa_Veiculo },
      });

      if (!veiculo) {
        res.status(404).json({ message: 'Veículo não encontrado na sua loja.' });
        return;
      }

      res.status(200).json(veiculo);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar veículo pela Placa' });
      console.error(error);
    }
  },
];