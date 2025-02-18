//src/routes/clientesRoutes.ts
import fs from 'fs';
import path from 'path';
import { Router } from 'express';

const rotas = Router(); // Cria um router para armazenar todas as rotas
const routesFolderPath = path.join(__dirname); // Caminho para a pasta 'routes'

// Lê todos os arquivos dentro da pasta 'routes'
fs.readdirSync(routesFolderPath).forEach((file) => {
  // Ignora o próprio arquivo 'index.ts' para não importar ele mesmo
  if (file !== 'index.ts' && file.endsWith('.ts')) {
    const routePath = path.join(routesFolderPath, file);

    // Importa as rotas de forma síncrona com require
    const route = require(routePath).default;

    // Verifica se o arquivo exporta um Router
    if (route && typeof route === 'function') {
      rotas.use(route); // Adiciona a rota às rotas
    } else {
      console.error(`O arquivo ${file} não exporta uma rota válida`);
    }
  }
});

// Exporta todas as rotas reunidas no router
export default rotas;

