//src/consultasSQL/consultasFinanciamentos.ts

export const GET_FINANCIAMENTOS_BY_LOJA = `
  SELECT f.* FROM Financiamentos f
    JOIN 
        Clientes cl ON f.Clientes_idCliente = cl.idCliente
            JOIN 
                Lojas l ON cl.Lojas_idLoja = l.idLoja
                    WHERE 
                        l.idLoja = :idLoja`;
