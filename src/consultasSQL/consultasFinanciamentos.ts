//src/consultasSQL/consultasFinanciamentos.ts

export const GET_FINANCIAMENTOS_BY_EMPRESA = `
  SELECT f.* FROM Financiamentos f
    JOIN 
        Clientes cl ON f.Clientes_idCliente = cl.idCliente
            JOIN 
                Empresas l ON cl.Empresas_idEmpresa = l.idEmpresa
                    WHERE 
                        l.idEmpresa = :idEmpresa`;
