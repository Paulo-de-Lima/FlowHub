import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import clientesRouter from './routes/clientes';
import cobrancasRouter from './routes/cobrancas';
import financeiroRouter from './routes/financeiro';
import manutencoesRouter from './routes/manutencoes';
import materiaisRouter from './routes/materiais';
import mesasRouter from './routes/mesas';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use((_req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    res.charset = 'utf-8';
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return originalJson(body);
  };
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/clientes', clientesRouter);
app.use('/cobrancas', cobrancasRouter);
app.use('/materiais', materiaisRouter);
app.use('/financeiro', financeiroRouter);
app.use('/manutencoes', manutencoesRouter);
app.use('/', mesasRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`FlowHub API rodando em http://localhost:${port}`);
  console.log(`Rede local: http://0.0.0.0:${port} (use o IP da máquina no celular físico)`);
});
