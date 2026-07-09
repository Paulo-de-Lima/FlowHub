import { Router, type Request, type Response } from 'express';

import { excluirClienteComDependencias } from '../lib/excluir-cliente';
import { prisma } from '../lib/prisma';

const router = Router();

type ClienteBody = {
  nome?: string | null;
  numero?: string | null;
  endereco?: string | null;
  cpf?: string | null;
};

function normalizeTelefone(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text || null;
}

function parseId(value: string | string[]): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number.parseInt(raw, 10);
  return Number.isNaN(id) ? null : id;
}

router.get('/', async (_req: Request, res: Response) => {
  try {
    const clientes = await prisma.clientes.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(clientes);
  } catch (error) {
    console.error('[GET /clientes]', error);
    res.status(500).json({ error: 'Erro ao listar clientes.' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  try {
    const cliente = await prisma.clientes.findUnique({ where: { id } });

    if (!cliente) {
      res.status(404).json({ error: 'Cliente não encontrado.' });
      return;
    }

    res.json(cliente);
  } catch (error) {
    console.error('[GET /clientes/:id]', error);
    res.status(500).json({ error: 'Erro ao buscar cliente.' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const body = req.body as ClienteBody;

  try {
    const cliente = await prisma.clientes.create({
      data: {
        nome: body.nome ?? null,
        numero: normalizeTelefone(body.numero),
        endereco: body.endereco ?? null,
        cpf: body.cpf ?? null,
      },
    });

    res.status(201).json(cliente);
  } catch (error) {
    console.error('[POST /clientes]', error);
    res.status(500).json({ error: 'Erro ao criar cliente.' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  const body = req.body as ClienteBody;

  try {
    const cliente = await prisma.clientes.update({
      where: { id },
      data: {
        nome: body.nome,
        numero: normalizeTelefone(body.numero),
        endereco: body.endereco,
        cpf: body.cpf,
      },
    });

    res.json(cliente);
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).json({ error: 'Cliente não encontrado.' });
      return;
    }

    console.error('[PUT /clientes/:id]', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente.' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ error: 'ID inválido.' });
    return;
  }

  try {
    await excluirClienteComDependencias(id);
    res.status(204).send();
  } catch (error) {
    if (isNotFoundError(error)) {
      res.status(404).json({ error: 'Cliente não encontrado.' });
      return;
    }

    console.error('[DELETE /clientes/:id]', error);
    res.status(500).json({ error: 'Erro ao excluir cliente.' });
  }
});

function isNotFoundError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2025'
  );
}

export default router;
